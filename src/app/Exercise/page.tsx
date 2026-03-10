"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/Authcontext";
import api from "../../utility/axiosInstance";
import { IoMdClose, IoMdCheckmark } from "react-icons/io";
import ExerciseCard from "@/components/ExerciseCard";

// --- CONFIGURATION ---
const CATEGORY_IMAGES: Record<string, string> = {
  "Clock": "/icons/clock.png",
  "Shape": "/icons/shapes.png",
  "Counting": "/icons/counting.png",
  "Fraction": "/icons/fraction.png",
  "DataChart": "/icons/chart.png",
  "Arith": "/icons/math.png",
  "Compare": "/icons/compare.png",
  "Sequence": "/icons/sequence.png",
  "Default_MCQ": "/icons/test.png", // Fallback for MCQ subjects
};

const DEFAULT_IMAGE = "/icons/default-exercise.png";

// --- Interfaces ---
interface ApiData {
  exercises: { [key: string]: string[] };
}

interface Subject { id: number; name: string; }
interface Chapter { id: number; name: string; }

export default function ExercisePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // --- Data State ---
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  // --- UI State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMcqMode, setIsMcqMode] = useState(false);

  // --- Selection State ---
  const [selectedSubExercises, setSelectedSubExercises] = useState<string[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");

  // Loading States
  const [loadingChapters, setLoadingChapters] = useState(false);

  // --- 1. Fetch Dashboard & Subjects (Using User Class) ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const dashboardRes = await api.get('/dashboard/');
        setApiData(dashboardRes.data);

        // Fetch subjects directly using user.class_num
        if (user?.class_num) {
          const mcqRes = await api.get(`/mcq/user/subjects?class_id=${user.class_num}`);
          setSubjects(mcqRes.data.results || mcqRes.data);
        }
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };
    if (user) fetchInitialData();
  }, [user]);

  // --- 2. Fetch Chapters when an MCQ Subject is selected ---
  useEffect(() => {
    const fetchChapters = async () => {
      if (!selectedSubjectId) { setChapters([]); return; }
      setLoadingChapters(true);
      try {
        const res = await api.get(`/mcq/user/chapters?subject_id=${selectedSubjectId}`);
        setChapters(res.data.results || res.data);
      } catch (err) { 
        console.error(err); 
        setChapters([]); 
      } finally { 
        setLoadingChapters(false); 
      }
    };
    fetchChapters();
  }, [selectedSubjectId]);

  // --- Handlers ---

  const handleStandardCardClick = (category: string) => {
    setIsMcqMode(false);
    setActiveCategory(category);
    setSelectedSubExercises([]);
    setIsModalOpen(true);
  };

  const handleMcqCardClick = (subject: Subject) => {
    setIsMcqMode(true);
    setActiveCategory(`MCQ - ${subject.name}`);
    setSelectedSubjectId(subject.id);
    setSelectedChapterId("");
    setIsModalOpen(true);
  };

  const toggleStandardSelection = (sub: string) => {
    setSelectedSubExercises(prev => 
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const startStandardGame = () => {
    if (!activeCategory || selectedSubExercises.length === 0) return;
    const selectionData = selectedSubExercises.map(sub => ({
        category: activeCategory,
        sub: sub
    }));
    router.push(`/startexercise?data=${encodeURIComponent(JSON.stringify(selectionData))}`);
  };

  const startMcqGame = () => {
    if (!selectedChapterId) return;
    router.push(`/startexercise?chapterId=${selectedChapterId}&mode=mcq`);
  };

  if (loading) return <div className="p-10 text-center text-xl font-bold text-blue-500 animate-pulse mt-20">Loading Fun...</div>;

  return (
    <div className="min-h-screen pt-32 pb-12 flex flex-col items-center bg-blue-50 px-6 font-sans relative">
      
      {/* --- HEADER --- */}
      <div className="w-full max-w-6xl mb-16 flex flex-col md:flex-row items-center justify-between z-10 relative bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50">
        <Link href="/UserDashboard" className="text-blue-600 hover:text-blue-800 font-extrabold text-lg flex items-center gap-2 transition-transform hover:-translate-x-1 mb-4 md:mb-0">
          <span className="text-2xl bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center pb-1">&larr;</span> Back
        </Link>
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight text-center drop-shadow-sm">
          Choose Your Exercise! 
        </h1>
        <div className="w-24 hidden md:block"></div>
      </div>

      {/* --- MAIN GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl z-10">
        
        {/* 1. Standard Exercises */}
        {apiData?.exercises && Object.keys(apiData.exercises).map((category) => {
          if (category === "MCQ Practice") return null; // Hide old generic MCQ category
          return (
            <ExerciseCard
              key={category}
              category={category}
              imageSrc={CATEGORY_IMAGES[category] || DEFAULT_IMAGE}
              onClick={() => handleStandardCardClick(category)} 
            />
          );
        })}

        {/* 2. MCQ Subjects as individual cards */}
        {subjects.map((subject) => (
          <ExerciseCard
            key={`mcq-${subject.id}`}
            category={`MCQ - ${subject.name}`}
            imageSrc={CATEGORY_IMAGES["MCQ Practice"] || CATEGORY_IMAGES["Default_MCQ"]}
            onClick={() => handleMcqCardClick(subject)} 
          />
        ))}
      </div>

      {/* --- UNIVERSAL MODAL --- */}
      {isModalOpen && activeCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] transform transition-all scale-100 border-4 border-white">
            
            {/* Modal Header */}
            <div className={`p-5 flex justify-between items-center shrink-0 bg-gradient-to-r ${isMcqMode ? 'from-purple-600 to-purple-500' : 'from-blue-600 to-blue-500'}`}>
              <div>
                <h2 className="text-white text-2xl font-black uppercase tracking-wide">{activeCategory}</h2>
                <p className="text-blue-100 text-sm font-medium opacity-90">
                  {isMcqMode ? "Choose a Chapter to start the test" : "Select specific games"}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition backdrop-blur-sm">
                <IoMdClose size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-grow bg-gray-50">
              
              {isMcqMode ? (
                /* === MCQ CHAPTER SELECTION === */
                <div className="space-y-3">
                  {loadingChapters ? (
                    <div className="p-8 text-center text-gray-500 font-bold animate-pulse">Loading Chapters...</div>
                  ) : chapters.length > 0 ? (
                    chapters.map(chap => (
                      <button 
                        key={chap.id} 
                        onClick={() => setSelectedChapterId(chap.id.toString())}
                        className={`w-full text-left p-4 rounded-xl border-2 shadow-sm font-bold transition-all flex justify-between items-center ${
                          selectedChapterId === chap.id.toString() 
                          ? "bg-purple-50 border-purple-500 text-purple-700" 
                          : "bg-white border-gray-100 text-gray-700 hover:border-purple-300"
                        }`}
                      >
                        {chap.name}
                        {selectedChapterId === chap.id.toString() && <IoMdCheckmark size={24} className="text-purple-600" />}
                      </button>
                    ))
                  ) : (
                    <p className="text-center py-10 text-gray-400 font-bold">No chapters available for this subject.</p>
                  )}

                  <button 
                    onClick={startMcqGame} 
                    disabled={!selectedChapterId}
                    className="w-full bg-purple-600 text-white px-8 py-4 mt-6 rounded-xl font-black shadow-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform transition flex items-center justify-center gap-2"
                  >
                    START MCQ TEST <span className="text-xl">🚀</span>
                  </button>
                </div>
              ) : (
                /* === STANDARD EXERCISE SELECTION === */
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {apiData?.exercises[activeCategory]?.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => toggleStandardSelection(sub)}
                        className={`p-3 rounded-xl border-2 font-bold text-sm transition-all active:scale-95 flex flex-col items-center justify-center text-center h-24 ${
                          selectedSubExercises.includes(sub)
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                            : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        <span className="break-words w-full">{sub.replace(/_/g, " ")}</span>
                        {selectedSubExercises.includes(sub) && <IoMdCheckmark className="mt-1" />}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={startStandardGame}
                    disabled={selectedSubExercises.length === 0}
                    className="w-full mt-auto bg-gradient-to-r from-orange-400 to-red-500 text-white text-lg font-black py-4 rounded-xl shadow-lg border-b-4 border-red-600 active:border-b-0 active:translate-y-1 hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    PLAY NOW! 🚀
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}