"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { InlineMath } from "react-katex";
import Link from "next/link";
import "katex/dist/katex.min.css";
import api from "../../utility/axiosInstance";

// --- Dynamic Component Imports ---
import Clock from "@/components/Clock";
import ShapeComponent from "@/components/Shape";
import StickComponent from "@/components/Stick";
import Fraction from "@/components/Fraction";
import DataChart from "@/components/DataChart";

// --- Interfaces ---
interface QuestionItem {
  id: number;
  sequence_number: number;
  group_name: string;
  exercise_name: string;
  question_text: string | number | object;
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
  const inputRef = useRef<HTMLInputElement>(null);

  // --- State ---
  const [hasStarted, setHasStarted] = useState(false); // New: Tracks if instructions are passed
  const [loading, setLoading] = useState(false); // Changed default to false (waiting for start)
  const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({}); 

  const [timeLeft, setTimeLeft] = useState<number>(20 * 60); 
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- 1. Start Quiz Logic (Moved from useEffect) ---
  const handleStartQuiz = async () => {
    setHasStarted(true);
    setLoading(true);

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

  // --- 2. Timer Logic ---
  useEffect(() => {
    // Only run timer if quiz has started, is loaded, and no result yet
    if (hasStarted && !loading && assessment && !result && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
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
  }, [hasStarted, loading, assessment, result]);

  // --- Auto-focus effect ---
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, loading, hasStarted]);

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
      const response = await api.post(`/assessments/finish/${sessionId}/`);
      setResult(response.data);
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

    // 🔒 Validation
    if (!currentAns.trim()) {
        alert("Please enter an answer to proceed.");
        return;
    }

    await submitSingleAnswer(currentItem.id, currentAns);

    if (currentIndex < assessment.items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleFinish = async () => {
    if (!assessment) return;
    const currentItem = assessment.items[currentIndex];
    const currentAns = answers[currentItem.id] || "";

    // 🔒 Validation
    if (!currentAns.trim()) {
        alert("Please enter an answer to finish.");
        return;
    }

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

  // --- 5. DYNAMIC CONTENT RENDERER ---
  const renderDynamicContent = () => {
    if (!assessment) return null;
    const question = assessment.items[currentIndex];
    const group = question.group_name?.toLowerCase();

    switch (group) {
      case "clock":
        return (
          <div className="my-6 flex-col">
            <p className="font-semibold text-center mb-4">
              Q: Tell the time <span>for example answer is <b>12:20</b></span>
            </p>
            <div className="flex justify-center items-center">
              <Clock time={(question.question_text as string) || "00:00"} />
            </div>
          </div>
        );

      case "shape":
        return (
          <div className="my-6 flex-col">
            <p className="font-semibold text-center mb-4">
              Q: Tell the shape
            </p>
            <div className="flex justify-center items-center">
              <ShapeComponent shape={(question.question_text as string) || null} />
            </div>
          </div>
        );

      case "counting":
        return (
          <div className="my-6 flex-col">
            <p className="font-semibold text-center mb-4">
              Q: Count the number of sticks
            </p>
            <div className="flex justify-center items-center">
              <StickComponent count={(question.question_text as string) || null} />
            </div>
          </div>
        );

      case "fraction":
        return (
          <div className="my-6 flex-col">
            <p className="font-semibold text-center mb-4">
              Q: Tell the fraction of colored region
            </p>
            <div className="flex justify-center items-center">
              <Fraction frac={(question.question_text as string) || "00:00"} />
            </div>
          </div>
        );

      case "datachart2":
      case "datachart":
        return (
          <div className="my-6 flex justify-center items-center w-full">
             <DataChart 
              data={question.question_text as { 
                data_values: Record<string, number | string>; 
                find_type: string; 
              }} 
            />
          </div>
        );

      case "arith":
        return (
          <div className="text-4xl font-bold text-gray-800 mb-6 text-center">
             <InlineMath math={(question.question_text as string) || ""} />
          </div>
        );

      default:
        return (
          <div className="text-center w-full">
            <div className="text-3xl font-bold text-gray-800 mb-6">
                Q: <InlineMath math={(question.question_text as string) || ""} />
            </div>
          </div>
        );
    }
  };

  // --- 6. RENDER LOGIC ---

  // ✅ 6A. INSTRUCTION SCREEN
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg border-t-4 border-blue-600">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Quiz Instructions 📝</h1>
          
          <div className="space-y-4 text-gray-700 mb-8">
            <p className="font-medium">Please read the following rules carefully before starting:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-bold text-red-500">Time Bound:</span> The quiz has a strict time limit. It will auto-submit when time runs out.
              </li>
              <li>
                <span className="font-bold text-blue-500">No Skipping:</span> You cannot skip questions. An answer is required to proceed.
              </li>
              <li>
                <span className="font-bold text-orange-500">One Way:</span> You cannot go back to previous questions once answered.
              </li>
              <li>
                <span className="font-bold text-gray-500">No Pausing:</span> Once started, the timer cannot be paused.
              </li>
              <li>
                Click <span className="font-bold">Finish</span> on the last question to complete the quiz.
              </li>
            </ul>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform"
          >
            Start Quiz &rarr;
          </button>
          
          <div className="mt-4 text-center">
            <Link href="/Dashboard" className="text-gray-400 hover:text-gray-600 text-sm">
              Cancel and return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ✅ 6B. LOADING SCREEN
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Quiz Question...</div>;
  
  // ✅ 6C. RESULT VIEW
  if (result) {
    const percentage = Math.round((result.score / result.total_questions) * 100);
    
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
          
          <div className="text-center border-b pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed! 🎉</h1>
            <p className="text-gray-500">Here is your performance summary</p>
          </div>

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

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Question Review</h3>
            {result.items.map((item, index) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4 mb-2 sm:mb-0 w-full">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="text-lg font-medium text-gray-800 w-full">
                    {/* Safe check for rendering text vs object in result view */}
                    <InlineMath math={typeof item.question_text === 'string' ? item.question_text : "Visual Question"} />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                   <span className="text-sm text-gray-500 mr-2">Your Answer:</span>
                   <span className={`px-4 py-1 rounded-full font-bold text-white ${item.user_response ? 'bg-blue-500' : 'bg-gray-400'}`}>
                      {item.user_response || "Skipped"}
                   </span>
                </div>
              </div>
            ))}
          </div>

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

  // ✅ 6D. ACTIVE QUIZ VIEW
  if (!assessment) return null;

  const currentQuestion = assessment.items[currentIndex];
  const currentAnswer = answers[currentQuestion.id] || "";
  const progressPercent = ((currentIndex + 1) / assessment.total_questions) * 100;
  const isLastQuestion = currentIndex === assessment.items.length - 1;
  const timerColor = timeLeft < 60 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-700";

  // Validate input to enable/disable buttons
  const isInputEmpty = !currentAnswer || currentAnswer.trim() === "";

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

        {/* Dynamic Question Content */}
        <div className="flex-grow flex flex-col justify-center items-center">
            <div className="text-center w-full">
                {renderDynamicContent()}
            </div>
        </div>

        {/* Input */}
        <div className="mt-4">
            <input
                ref={inputRef}
                type="text"
                className="w-full border-2 border-gray-300 p-3 rounded-lg mt-2 shadow-sm text-lg text-center font-bold tracking-widest focus:border-green-500 focus:outline-none transition-colors"
                placeholder="Enter Answer"
                value={currentAnswer}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (isInputEmpty) return; // Block enter if empty
                        
                        if (isLastQuestion) {
                            handleFinish();
                        } else {
                            handleNext();
                        }
                    }
                }}
                autoFocus
            />
        </div>

        {/* Navigation - Only NEXT or FINISH */}
        <div className="flex justify-end items-center mt-8">
            {isLastQuestion ? (
                <button
                    onClick={handleFinish}
                    disabled={isInputEmpty}
                    className={`px-6 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded shadow-lg transition-transform font-bold 
                    ${isInputEmpty ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
                >
                    Finish Quiz
                </button>
            ) : (
                <button
                    onClick={handleNext}
                    disabled={isInputEmpty}
                    className={`px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded shadow-lg transition-transform font-bold
                    ${isInputEmpty ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
                >
                    Next &rarr;
                </button>
            )}
        </div>

      </div>
    </div>
  );
}