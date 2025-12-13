"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { InlineMath } from "react-katex";
import Link from "next/link";
import "katex/dist/katex.min.css";
import api from "../../utility/axiosInstance";

// --- Interfaces ---
interface QuestionItem {
  id: number;
  sequence_number: number;
  group_name: string;
  exercise_name: string;
  question_text: string;
  user_response: string | null;
  is_attempted: boolean;
  time_taken: number | null;
}

interface AssessmentResponse {
  id: number;
  type: string;
  duration?: number;
  total_questions: number;
  items: QuestionItem[];
}

// Interface for the Result Data (matches your JSON)
interface QuizResult {
  id: number;
  score: number;
  total_questions: number;
  time_taken: number;
  items: QuestionItem[];
}

export default function QuizPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading Quiz...</div>}>
      <QuizPage />
    </Suspense>
  );
}

function QuizPage() {
  const router = useRouter();

  // Data State
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null); // State for Final Result
  
  // Quiz Interaction State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({}); 

  // Timer State
  const [timeLeft, setTimeLeft] = useState<number>(20 * 60); 
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- 1. Initialize Quiz ---
  useEffect(() => {
    const initQuiz = async () => {
      try {
        const res = await api.post("/assessments/start/", {
          type: "QUIZ",
        });
        const data: AssessmentResponse = res.data;
        setAssessment(data);

        const initialAnswers: { [key: number]: string } = {};
        data.items.forEach((item) => {
          if (item.user_response) initialAnswers[item.id] = item.user_response;
        });
        setAnswers(initialAnswers);

        if (data.duration) {
            setTimeLeft(data.duration); 
        }

        setLoading(false);
      } catch (err) {
        console.error("Error starting quiz:", err);
        alert("Failed to load quiz.");
        router.push("/Dashboard");
      }
    };

    initQuiz();
  }, [router]);

  // --- 2. Timer Logic ---
  useEffect(() => {
    // Only run timer if we are NOT loading, have an assessment, and NO result yet
    if (!loading && assessment && !result && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, assessment, result]); // Added 'result' dependency to stop timer on finish

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // --- 3. API Actions ---

  const submitSingleAnswer = async (questionId: number, answer: string) => {
    try {
      await api.post('/assessments/submit-answer/', {
        question_id: questionId,
        answer: answer
      });
    } catch (error) {
      console.error(`Failed to save question ${questionId}`, error);
    }
  };

  const finishSession = async (sessionId: number) => {
    try {
      // Fetch the result data instead of just redirecting
      const response = await api.post(`/assessments/finish/${sessionId}/`);
      setResult(response.data); // Store the result to trigger the Result View
    } catch (error) {
      console.error("Failed to finish session", error);
      alert("Error finishing session. Please try again.");
    }
  };

  // --- 4. Handlers ---

  const handleInputChange = (val: string) => {
    if (!assessment) return;
    const currentQId = assessment.items[currentIndex].id;
    setAnswers((prev) => ({ ...prev, [currentQId]: val }));
  };

  const handleNext = async () => {
    if (!assessment) return;
    const currentItem = assessment.items[currentIndex];
    const currentAns = answers[currentItem.id] || "";
    await submitSingleAnswer(currentItem.id, currentAns);

    if (currentIndex < assessment.items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleFinish = async () => {
    if (!assessment) return;
    const currentItem = assessment.items[currentIndex];
    const currentAns = answers[currentItem.id] || "";
    await submitSingleAnswer(currentItem.id, currentAns);
    await finishSession(assessment.id);
  };

  const handleAutoSubmit = async () => {
    if (!assessment) return;
    const currentItem = assessment.items[currentIndex];
    const currentAns = answers[currentItem.id] || "";
    await submitSingleAnswer(currentItem.id, currentAns);
    await finishSession(assessment.id);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // --- 5. RENDER LOGIC ---

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Quiz...</div>;
  
  // ✅ RESULT VIEW (Shows when 'result' state is populated)
  if (result) {
    const percentage = Math.round((result.score / result.total_questions) * 100);
    
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
          
          {/* Result Header */}
          <div className="text-center border-b pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed! 🎉</h1>
            <p className="text-gray-500">Here is your performance summary</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <span className="block text-gray-500 text-sm font-semibold uppercase">Score</span>
              <span className="text-3xl font-bold text-blue-600">{result.score} / {result.total_questions}</span>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <span className="block text-gray-500 text-sm font-semibold uppercase">Percentage</span>
              <span className="text-3xl font-bold text-green-600">{percentage}%</span>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <span className="block text-gray-500 text-sm font-semibold uppercase">Time Taken</span>
              <span className="text-3xl font-bold text-purple-600">{result.time_taken.toFixed(1)}s</span>
            </div>
          </div>

          {/* Detailed Review List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Question Review</h3>
            {result.items.map((item, index) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4 mb-2 sm:mb-0">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="text-lg font-medium text-gray-800">
                    <InlineMath math={item.question_text} />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                   <span className="text-sm text-gray-500 mr-2">Your Answer:</span>
                   <span className={`px-4 py-1 rounded-full font-bold text-white ${item.user_response ? 'bg-blue-500' : 'bg-gray-400'}`}>
                      {item.user_response || "Skipped"}
                   </span>
                </div>
              </div>
            ))}
          </div>

          {/* Back to Dashboard */}
          <div className="mt-8 text-center">
            <Link 
              href="/Dashboard"
              className="inline-block px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors shadow-md"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ✅ QUIZ VIEW (Shows while taking the quiz)
  if (!assessment) return null;

  const currentQuestion = assessment.items[currentIndex];
  const currentAnswer = answers[currentQuestion.id] || "";
  const progressPercent = ((currentIndex + 1) / assessment.total_questions) * 100;
  const isLastQuestion = currentIndex === assessment.items.length - 1;
  const timerColor = timeLeft < 60 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-700";

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="relative bg-white p-6 rounded-lg shadow-md w-full max-w-xl min-h-[450px] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <div>
            <h1 className="text-xl font-bold">Quiz Mode</h1>
            <span className="text-sm text-gray-500">
                Question {currentIndex + 1} of {assessment.total_questions}
            </span>
          </div>
          <div className={`text-right text-lg font-mono font-bold px-3 py-1 rounded ${timerColor}`}>
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
          <div 
            className="bg-green-600 h-1.5 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Question */}
        <div className="flex-grow flex flex-col justify-center items-center">
            <div className="text-center w-full">
                <div className="flex justify-center gap-2 mb-6">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {currentQuestion.group_name}
                    </span>
                    <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {currentQuestion.exercise_name}
                    </span>
                </div>
                
                <div className="text-4xl font-bold text-gray-800 mb-6">
                    <InlineMath math={currentQuestion.question_text || ""} />
                </div>
            </div>
        </div>

        {/* Input */}
        <div className="mt-4">
            <input
                type="text"
                className="w-full border-2 border-gray-300 p-3 rounded-lg mt-2 shadow-sm text-lg text-center font-bold tracking-widest focus:border-green-500 focus:outline-none transition-colors"
                placeholder="Enter Answer"
                value={currentAnswer}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        isLastQuestion ? handleFinish() : handleNext();
                    }
                }}
                autoFocus
            />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
            <button 
                onClick={handlePrev} 
                disabled={currentIndex === 0}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                    currentIndex === 0 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
                &larr; Previous
            </button>

            {isLastQuestion ? (
                <button
                    onClick={handleFinish}
                    className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded shadow-lg hover:scale-105 transition-transform font-bold"
                >
                    Finish Quiz
                </button>
            ) : (
                <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded shadow-lg hover:scale-105 transition-transform font-bold"
                >
                    Next &rarr;
                </button>
            )}
        </div>

      </div>
    </div>
  );
}