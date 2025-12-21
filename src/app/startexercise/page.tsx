"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { IoMdSkipForward } from "react-icons/io";
import { FaPause, FaStop } from "react-icons/fa";
import { GrResume } from "react-icons/gr";

import api from "../../utility/axiosInstance";

// --- Dynamic Components ---
import Clock from "@/components/Clock";
import ShapeComponent from "@/components/Shape";
import StickComponent from "@/components/Stick";
import Fraction from "@/components/Fraction";
import DataChart from "@/components/DataChart";

// --- Interfaces ---
interface Question {
  question: string | number | object;
  text?: string;
  options?: string[];
  redirect?: string;
  type?: string;
  qns?: string;
  debug?: { is_test_user?: boolean };
}

interface SelectionItem {
  category: string;
  sub: string;
}

export default function StartExercisePageWrapper() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading Exercise...</div>}>
      <StartExercise />
    </Suspense>
  );
}

function StartExercise() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const hasInitialized = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [answer, setAnswer] = useState("");
  const [groupName, setGroupName] = useState<string | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!isPaused && !loading && !error) startTimer();
    else pauseTimer();
    return pauseTimer;
  }, [isPaused, loading, error]);

  const generateClockOptions = (correctTime: string) => {
    const parts = correctTime.split(":");
    if (parts.length < 2) return []; 
    
    const hStr = parts[0];
    const mStr = parts[1];
    const h = parseInt(hStr, 10);
    
    const opts = new Set<string>();
    opts.add(correctTime);

    while (opts.size < 4) {
      const shift = Math.floor(Math.random() * 11) + 1;
      let newH = (h + shift) % 12;
      if (newH === 0) newH = 12;
      
      const newHStr = newH.toString().padStart(2, "0");
      opts.add(`${newHStr}:${mStr}`);
    }

    return Array.from(opts).sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    
    const initExerciseSession = async () => {
      const data = searchParams.get("data");

      if (!data) {
        setError("No exercise data provided.");
        setLoading(false);
        return;
      }

      hasInitialized.current = true;

      try {
        const parsed: SelectionItem[] = JSON.parse(data);
        if (parsed.length === 0) {
          setError("No exercises selected.");
          setLoading(false);
          return;
        }

        const group_name = parsed[0].category;
        const exercise_names = parsed.map((item) => item.sub.toUpperCase());
        const console_played_entered = 1;

        await api.post('/start-session/', {
          group_name,
          exercise_names,
          console_played_entered,
        });

        await fetchQuestion(group_name, exercise_names);

      } catch (err) {
        console.error(err);
        setError("Failed to start session.");
        setLoading(false);
      }
    };

    initExerciseSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const fetchQuestion = async (group_name: string, exercise_names: string[]) => {
    try {
      const response = await api.post('/exercise/', {
        group_name,
        exercise_names,
        console_played_entered: "0",
      });

      const data = response.data;

      if (group_name?.toLowerCase() === "clock" && typeof data.question === "string") {
        data.options = generateClockOptions(data.question);
      }

      setQuestion(data);
      setGroupName(group_name || null);
      
      setAnswer("");
      setIsPaused(false);
      setLoading(false);
      
      setTimeout(() => inputRef.current?.focus(), 100);

    } catch (err) {
      console.error(err);
      setError("Failed to fetch question.");
      setLoading(false);
    }
  };

  const handleSubmit = async (manualAnswer?: string) => {
    const finalAnswer = typeof manualAnswer === "string" ? manualAnswer : answer;

    if (!finalAnswer.trim()) return;

    try {
      const response = await api.post('/exercise/submit/', { 
        type: "submit", 
        a: finalAnswer
      });

      const data = response.data;

      if (groupName?.toLowerCase() === "clock" && typeof data.question === "string") {
        data.options = generateClockOptions(data.question);
      }
      
      setQuestion({ 
          question: data.question,
          text: data.text,
          options: data.options,
          type: data.type,
          debug: data.debug
      });
      setAnswer("");
      setIsPaused(false);
      
      setTimeout(() => inputRef.current?.focus(), 100);

      if (data.redirect) {
        if(data.debug?.is_test_user) {
          alert("Test user limit reached.");
        }
        router.push("/Dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to submit answer.");
    }
  };

  const handleSkip = async () => {
    try {
      const response = await api.post('/exercise/submit/', { 
        type: "skip" 
      });

      const data = response.data;

      if (groupName?.toLowerCase() === "clock" && typeof data.question === "string") {
        data.options = generateClockOptions(data.question);
      }

      setQuestion({ 
          question: data.question,
          text: data.text,
          options: data.options,
          type: data.type,
          debug: data.debug
      });
      setAnswer("");
      setIsPaused(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err) {
      console.error(err);
      setError("Failed to skip question.");
    }
  };

  const handlePauseToggle = async () => {
    const type = isPaused ? "resume" : "pause";
    try {
      await api.post('/exercise/submit/', { type });
      setIsPaused((prev) => !prev);
    } catch (err) {
      console.error("Failed to toggle pause", err);
    }
  };

  const handleStop = () => {
    router.push("/Dashboard");
  };

  const renderDynamicContent = () => {
    const group = groupName?.toLowerCase();

    switch (group) {
      case "clock":
        return (
          <div className="my-6 flex-col">
            <p className="font-semibold text-center mb-4">
              Q: Tell the time <span>(e.g. <b>12:20</b>)</span>
            </p>
            <div className="flex justify-center items-center">
              <Clock time={(question?.question as string) || "00:00"} />
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
              <ShapeComponent shape={(question?.question as string) || null} />
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
              <StickComponent count={(question?.question as string) || null} />
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
              <Fraction frac={(question?.question as string) || "00:00"} />
            </div>
          </div>
        );

      case "datachart2":
      case "datachart":
        return (
          <div className="my-6 flex justify-center items-center w-full">
             <DataChart 
              data={question?.question as { 
                data_values: Record<string, number | string>; 
                find_type: string; 
              }} 
            />
          </div>
        );

      case "arith":
        return (
          <div className="text-4xl font-bold text-gray-800 mb-6 text-center">
             <InlineMath math={(question?.question as string) || question?.text || ""} />
          </div>
        );

      default:
        return (
          <div className="text-center w-full">
            <div className="text-3xl font-bold text-gray-800 mb-6">
               Q: {(question?.question as string) || question?.text || ""}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="relative bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Start Exercise</h1>

        {loading && <p className="text-center py-10">Loading your session...</p>}
        {error && <p className="text-red-600 text-center py-10">{error}</p>}

        {!loading && !error && question && (
          <div className="space-y-4">
            <div className="text-right text-sm text-gray-600 font-mono">
              ⏱ {formatTime(timer)}
            </div>

            <div className="flex justify-center">
                {renderDynamicContent()}
            </div>

            {question.options && (
              // UPDATED: Grid Layout (2 columns = 2 items per row)
              <ul className="grid grid-cols-2 gap-4">
                {question.options.map((opt: string, idx: number) => (
                  <li 
                    key={idx} 
                    className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 cursor-pointer text-center font-bold shadow-sm transition-all hover:scale-105" 
                    onClick={() => {
                      setAnswer(opt);
                      if (groupName?.toLowerCase() === "clock") {
                        handleSubmit(opt);
                      }
                    }}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            )}

            {groupName?.toLowerCase() !== "clock" && (
              <input
                ref={inputRef}
                type="text"
                className="w-full border p-3 rounded mt-2 shadow-sm text-center font-bold"
                placeholder="Write your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isPaused) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                autoFocus
              />
            )}

            <div className="flex flex-wrap items-center justify-center cursor-pointer gap-3 mt-4">
              {isPaused ? (
                <p className="text-gray-500 font-semibold">Please resume to continue</p>
              ) : (
                groupName?.toLowerCase() !== "clock" && (
                  <button
                    onClick={() => handleSubmit()}
                    className="px-6 py-2 cursor-pointer hover:scale-105 transition duration-300 bg-gradient-to-r from-green-500 to-green-700 text-white rounded font-bold"
                  >
                    Submit
                  </button>
                )
              )}
            </div>
          </div>
        )}

        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-4">
          
          <button
            onClick={handlePauseToggle}
            className="group relative flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-lg hover:scale-110 transition-all text-gray-600"
          >
            {isPaused ? <GrResume /> : <FaPause />}
            <span className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
               {isPaused ? "Resume" : "Pause"}
            </span>
          </button>
          
          {!isPaused && (
            <button
                onClick={handleSkip}
                className="group relative flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-lg hover:scale-110 transition-all text-gray-600"
            >
                <IoMdSkipForward />
                <span className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                   Skip
                </span>
            </button>
          )}

          <button
            onClick={handleStop}
            className="group relative flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-lg hover:scale-110 transition-all text-red-500"
          >
            <FaStop />
            <span className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
               Stop
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}