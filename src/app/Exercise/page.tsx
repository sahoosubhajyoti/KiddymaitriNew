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
  "Sequence": "/icons/sequence.png", // Added based on your screenshot
  "MCQ Practice": "/icons/test.png",
};

const DEFAULT_IMAGE = "/icons/default-exercise.png";
const MCQ_CATEGORY = "MCQ Practice";

// --- Interfaces ---
interface ApiData {
  exercises: {
    [key: string]: string[];
  };
}

interface McqClass { id: number; name: string; }
interface McqClassResponse { count: number; results: McqClass[]; }
interface Subject { id: number; name: string; }
interface Chapter { id: number; name: string; }

export default function ExercisePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // --- Data State ---
  const [apiData, setApiData] = useState<ApiData | null>(null);
  
  // MCQ Specific Data
  const [mcqClasses, setMcqClasses] = useState<McqClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  // --- UI State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // --- Selection State ---
  const [selectedSubExercises, setSelectedSubExercises] = useState<string[]>([]);
  
  // For MCQ Exercises - IDs
  const [modalStep, setModalStep] = useState<"CLASS" | "SUBJECT" | "CHAPTER">("CLASS");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");

  // Loading States
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);

  // --- 1. Initial Fetch ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [dashboardRes, mcqRes] = await Promise.all([
          api.get('/dashboard/'),
          api.get<McqClassResponse>('/mcq/user/classes')
        ]);
        setApiData(dashboardRes.data);
        setMcqClasses(mcqRes.data.results || []);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };
    if (user) fetchInitialData();
  }, [user]);

  // --- 2. MCQ Fetchers ---
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedClassId) return;
      setLoadingSubjects(true);
      try {
        const res = await api.get(`/mcq/user/subjects?class_id=${selectedClassId}`);
        setSubjects(res.data.results || res.data);
      } catch (err) { console.error(err); setSubjects([]); } 
      finally { setLoadingSubjects(false); }
    };
    fetchSubjects();
  }, [selectedClassId]);

  useEffect(() => {
    const fetchChapters = async () => {
      if (!selectedSubjectId) { setChapters([]); return; }
      setLoadingChapters(true);
      try {
        const res = await api.get(`/mcq/user/chapters?subject_id=${selectedSubjectId}`);
        setChapters(res.data.results || res.data);
      } catch (err) { console.error(err); setChapters([]); } 
      finally { setLoadingChapters(false); }
    };
    fetchChapters();
  }, [selectedSubjectId]);

  // --- Handlers ---

  const handleCardClick = (category: string) => {
    setActiveCategory(category);
    setIsModalOpen(true);
    
    // Reset States
    setSelectedSubExercises([]);
    setModalStep("CLASS");
    setSelectedClassId("");
    setSelectedSubjectId("");
    setSelectedChapterId("");
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

  // Prepare Data
  const displayExercises = { ...apiData?.exercises };
  if (!displayExercises[MCQ_CATEGORY]) displayExercises[MCQ_CATEGORY] = [];

  return (
    // UPDATED: Added pt-32 (padding-top: 8rem) to clear the top navbar
    <div className="min-h-screen pt-32 pb-12 flex flex-col items-center bg-blue-50 px-6 font-sans relative">
      
      {/* --- HEADER --- */}
      {/* UPDATED: Added mb-16 to create a clear gap between this header and the grid below */}
      <div className="w-full max-w-6xl mb-16 flex flex-col md:flex-row items-center justify-between z-10 relative bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50">
        <Link href="/UserDashboard" className="text-blue-600 hover:text-blue-800 font-extrabold text-lg flex items-center gap-2 transition-transform hover:-translate-x-1 mb-4 md:mb-0">
          <span className="text-2xl bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center pb-1">&larr;</span> Back
        </Link>
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight text-center drop-shadow-sm">
          Choose Your Game! 🎮
        </h1>
        <div className="w-24 hidden md:block"></div> {/* Spacer for alignment */}
      </div>

      {/* --- MAIN GRID (Clean, Image Only) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl z-10">
        {Object.keys(displayExercises).map((category) => {
          const imagePath = CATEGORY_IMAGES[category] || DEFAULT_IMAGE;

          return (
            <ExerciseCard
              key={category}
              category={category}
              imageSrc={imagePath}
              onClick={() => handleCardClick(category)} 
            />
          );
        })}
      </div>

      {/* --- UNIVERSAL MODAL --- */}
      {isModalOpen && activeCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] transform transition-all scale-100 border-4 border-white">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-white text-2xl font-black uppercase tracking-wide">{activeCategory}</h2>
                <p className="text-blue-100 text-sm font-medium opacity-90">
                  {activeCategory === MCQ_CATEGORY 
                    ? "Select your MCQ topic" 
                    : "Select specific games"}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition backdrop-blur-sm">
                <IoMdClose size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-grow bg-gray-50">
              
              {/* === OPTION A: MCQ FLOW === */}
              {activeCategory === MCQ_CATEGORY ? (
                <div className="space-y-4">
                  {/* Step Indicators */}
                  <div className="flex justify-between mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest px-2">
                    <span className={modalStep === "CLASS" ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""}>1. Class</span>
                    <span className={modalStep === "SUBJECT" ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""}>2. Subject</span>
                    <span className={modalStep === "CHAPTER" ? "text-blue-600 border-b-2 border-blue-600 pb-1" : ""}>3. Chapter</span>
                  </div>

                  {/* MCQ Content */}
                  <div className="space-y-2">
                    {modalStep === "CLASS" && mcqClasses.map(cls => (
                      <button key={cls.id} onClick={() => { setSelectedClassId(cls.id.toString()); setModalStep("SUBJECT"); }}
                        className="w-full text-left p-4 rounded-xl bg-white border-2 border-gray-100 shadow-sm hover:border-blue-400 hover:bg-blue-50 font-bold text-gray-700 transition-all flex justify-between items-center group">
                        {cls.name} <span className="text-gray-300 group-hover:text-blue-400">➜</span>
                      </button>
                    ))}

                    {modalStep === "SUBJECT" && (
                       loadingSubjects ? <div className="p-8 text-center text-gray-500 font-bold">Loading Subjects...</div> : 
                       subjects.map(sub => (
                          <button key={sub.id} onClick={() => { setSelectedSubjectId(sub.id.toString()); setModalStep("CHAPTER"); }}
                            className="w-full text-left p-4 rounded-xl bg-white border-2 border-gray-100 shadow-sm hover:border-purple-400 hover:bg-purple-50 font-bold text-gray-700 transition-all flex justify-between items-center group">
                            {sub.name} <span className="text-gray-300 group-hover:text-purple-400">➜</span>
                          </button>
                       ))
                    )}

                    {modalStep === "CHAPTER" && (
                       loadingChapters ? <div className="p-8 text-center text-gray-500 font-bold">Loading Chapters...</div> :
                       chapters.map(chap => (
                          <button key={chap.id} onClick={() => setSelectedChapterId(chap.id.toString())}
                            className={`w-full text-left p-4 rounded-xl border-2 shadow-sm font-bold transition-all flex justify-between items-center ${
                               selectedChapterId === chap.id.toString() 
                               ? "bg-green-50 border-green-500 text-green-700" 
                               : "bg-white border-gray-100 text-gray-700 hover:border-green-300"
                            }`}>
                            {chap.name}
                            {selectedChapterId === chap.id.toString() && <IoMdCheckmark size={24} className="text-green-600" />}
                          </button>
                       ))
                    )}
                  </div>

                  {/* MCQ Navigation */}
                  <div className="flex justify-between pt-4 mt-6 border-t border-gray-200">
                     {modalStep !== "CLASS" ? (
                        <button onClick={() => setModalStep(modalStep === "CHAPTER" ? "SUBJECT" : "CLASS")} className="text-gray-500 hover:text-gray-800 font-bold text-sm px-4 py-2 mt-2">
                           &larr; Back
                        </button>
                     ) : <div></div>}
                     
                     {modalStep === "CHAPTER" && (
                        <button onClick={startMcqGame} disabled={!selectedChapterId}
                          className="bg-green-500 text-white px-8 py-3 mt-2 rounded-xl font-black shadow-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition flex items-center gap-2">
                          START TEST <span className="text-xl">🚀</span>
                        </button>
                     )}
                  </div>
                </div>
              ) : (
                
                /* === OPTION B: STANDARD EXERCISE FLOW === */
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {displayExercises[activeCategory]?.length > 0 ? (
                      displayExercises[activeCategory].map((sub) => {
                        const isSelected = selectedSubExercises.includes(sub);
                        return (
                          <button
                            key={sub}
                            onClick={() => toggleStandardSelection(sub)}
                            className={`p-3 rounded-xl border-2 font-bold text-sm md:text-base transition-all active:scale-95 flex flex-col items-center justify-center text-center h-24 ${
                              isSelected
                                ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                                : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                            }`}
                          >
                            <span className="break-words w-full">{sub.replace(/_/g, " ")}</span>
                            {isSelected && <IoMdCheckmark className="mt-1" />}
                          </button>
                        );
                      })
                    ) : (
                      <div className="col-span-2 flex flex-col items-center justify-center py-10 text-gray-400">
                        <span className="text-4xl mb-2">📭</span>
                        <p className="font-bold">No games found here.</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={startStandardGame}
                    disabled={selectedSubExercises.length === 0}
                    className="w-full mt-auto bg-gradient-to-r from-orange-400 to-red-500 text-white text-lg font-black py-4 rounded-xl shadow-lg border-b-4 border-red-600 active:border-b-0 active:translate-y-1 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-300"
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