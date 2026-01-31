"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/Authcontext";
import ExerciseCard from "../../components/ExerciseCard";
import api from "../../utility/axiosInstance";

// --- Interfaces ---

// 1. Existing Dashboard Data
interface ApiData {
  exercises: {
    [key: string]: string[];
  };
}

// 2. New MCQ Class Data (From your JSON)
interface McqClass {
  id: number;
  name: string;
}

interface McqClassResponse {
  count: number;
  results: McqClass[];
}

// 3. Interfaces for the dynamic dropdowns
interface Subject {
  id: number;
  name: string;
}

interface Chapter {
  id: number;
  name: string;
}

const MCQ_CATEGORY = "MCQ Practice";

export default function ExercisePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // --- State ---
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [mcqClasses, setMcqClasses] = useState<McqClass[]>([]);
  
  // Stores the selected item on the main dashboard
  // For MCQ, 'sub' will store the Class Name (e.g., "6")
  const [selections, setSelections] = useState<{ category: string; sub: string }[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");

  // Loading states for the modal dropdowns
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);

  // --- 1. Initial Fetch (Dashboard + Classes) ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [dashboardRes, mcqRes] = await Promise.all([
          api.get('/dashboard/'),
          api.get<McqClassResponse>('/mcq/user/classes')
        ]);

        setApiData(dashboardRes.data);
        // We use .results because your API returns { count: 1, results: [...] }
        setMcqClasses(mcqRes.data.results || []); 
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };

    if (user) {
      fetchInitialData();
    }
  }, [user]);

  // --- 2. Fetch Subjects when Modal Opens (dependent on selected Class) ---
  useEffect(() => {
    const fetchSubjects = async () => {
      // Only run if modal is open and we have a selected class
      if (!isModalOpen || selections.length === 0 || selections[0].category !== MCQ_CATEGORY) return;
      
      // Find the ID of the selected class name
      const className = selections[0].sub;
      const classObj = mcqClasses.find(c => c.name === className);
      if (!classObj) return;

      setLoadingSubjects(true);
      try {
        // ⚠️ REPLACE WITH YOUR ACTUAL SUBJECT ENDPOINT
        // Example: /mcq/user/subjects?class_id=1
        const res = await api.get(`/mcq/user/subjects?class_id=${classObj.id}`);
        setSubjects(res.data.results || res.data); // Adjust based on actual response structure
      } catch (err) {
        console.error("Error fetching subjects", err);
        // Fallback for testing UI if API fails
        setSubjects([{ id: 101, name: "Math" }, { id: 102, name: "Science" }]); 
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [isModalOpen, selections, mcqClasses]);

  // --- 3. Fetch Chapters when Subject Selected ---
  useEffect(() => {
    const fetchChapters = async () => {
      if (!selectedSubjectId) {
        setChapters([]);
        return;
      }

      setLoadingChapters(true);
      try {
        // ⚠️ REPLACE WITH YOUR ACTUAL CHAPTER ENDPOINT
        // Example: /mcq/user/chapters?subject_id=101
        const res = await api.get(`/mcq/user/chapters?subject_id=${selectedSubjectId}`);
        setChapters(res.data.results || res.data);
      } catch (err) {
        console.error("Error fetching chapters", err);
        // Fallback for testing UI
        setChapters([{ id: 201, name: "Algebra" }, { id: 202, name: "Geometry" }]);
      } finally {
        setLoadingChapters(false);
      }
    };

    fetchChapters();
  }, [selectedSubjectId]);


  // --- Handlers ---

  const handleSelection = (category: string, sub: string, isSelected: boolean) => {
    setSelections((prev) => {
      if (isSelected) {
        // Reset list if switching categories
        if (prev.length > 0 && prev[0].category !== category) {
          return [{ category, sub }];
        }
        // For MCQ, enforce single selection
        if (category === MCQ_CATEGORY) {
            return [{ category, sub }];
        }
        return [...prev, { category, sub }];
      } else {
        return prev.filter(item => !(item.category === category && item.sub === sub));
      }
    });
  };

  const handleStartButton = () => {
    if (selections.length > 0 && selections[0].category === MCQ_CATEGORY) {
      // Open Modal for MCQ
      setIsModalOpen(true);
      setSelectedSubjectId("");
      setSelectedChapterId("");
    } else {
      // Normal routing for other cards
      router.push(`/startexercise?data=${encodeURIComponent(JSON.stringify(selections))}`);
    }
  };

  const handleMcqFinalStart = () => {
    if (!selectedChapterId) return;
    // Navigate with the specific Chapter ID
    router.push(`/startexercise?chapterId=${selectedChapterId}`);
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  // --- Data merging for display ---
  const activeCategory = selections.length > 0 ? selections[0].category : null;
  const displayExercises = { ...apiData?.exercises };
  
  // Add MCQ card if we have classes
  if (mcqClasses.length > 0) {
    displayExercises[MCQ_CATEGORY] = mcqClasses.map(c => c.name);
  }

  return (
    <div className="min-h-screen mt-10 flex flex-col items-center bg-gray-50 p-6">
      
      {/* Header */}
      <div className="w-full max-w-4xl mb-6 flex items-center justify-between">
        <Link href="/Dashboard" className="text-gray-500 hover:text-gray-800 flex items-center gap-2">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl text-center">
        <h1 className="text-2xl font-bold mb-2">Select Your Exercises 📚</h1>
        <p className="text-gray-600">Choose a category to begin.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8 w-full max-w-5xl">
        {Object.entries(displayExercises).map(([category, subExercises]) => {
          
          const selectedSubsForThisCard = selections
            .filter((item) => item.category === category)
            .map((item) => item.sub);

          const isDimmed = activeCategory && activeCategory !== category;

          return (
            <div
              key={category}
              className={`flex flex-col items-center transition-opacity duration-300 ${
                isDimmed ? "opacity-50 pointer-events-none" : "opacity-100"
              }`}
            >
              <ExerciseCard
                category={category}
                subExercises={subExercises || []}
                onSelect={handleSelection}
                selectedSubExercises={selectedSubsForThisCard}
              />

              {activeCategory === category && (
                <button
                  onClick={handleStartButton}
                  className="mt-4 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors animate-fade-in-up"
                >
                  {category === MCQ_CATEGORY ? "Configure Test" : "Start Practice"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* --- MCQ MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            
            <div className="bg-blue-600 p-4">
              <h2 className="text-white text-lg font-bold">Configure MCQ Test</h2>
              <p className="text-blue-100 text-sm">Class: {selections[0]?.sub}</p>
            </div>
            
            <div className="p-6 space-y-5">
              
              {/* Subject Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
                <select 
                  value={selectedSubjectId}
                  onChange={(e) => {
                    setSelectedSubjectId(e.target.value);
                    setSelectedChapterId(""); // Reset chapter
                  }}
                  disabled={loadingSubjects}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-100"
                >
                  <option value="" disabled>
                    {loadingSubjects ? "Loading Subjects..." : "-- Choose Subject --"}
                  </option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chapter Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Chapter</label>
                <select 
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  disabled={!selectedSubjectId || loadingChapters}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="" disabled>
                    {loadingChapters ? "Loading Chapters..." : "-- Choose Chapter --"}
                  </option>
                  {chapters.map((chap) => (
                    <option key={chap.id} value={chap.id}>
                      {chap.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleMcqFinalStart}
                disabled={!selectedChapterId}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}