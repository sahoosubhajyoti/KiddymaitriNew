"use client";

import { useEffect, useState, useRef, Suspense } from "react";
// 1. UPDATED IMPORTS: Import from 'next/navigation'
import { useRouter, useSearchParams } from "next/navigation";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { IoMdSkipForward } from "react-icons/io";
import { FaPause, FaStop } from "react-icons/fa";

import { GrResume } from "react-icons/gr";
import Clock from "@/components/Clock";
import ShapeComponent from "@/components/Shape";

// Interfaces remain the same
interface Question {
  question: string;
  text?: string;
  options?: string[];
  redirect?: string;
  type?: string;
  qns?: string;
}

interface SelectionItem {
  category: string;
  sub: string;
}

// It's good practice to wrap the component that uses useSearchParams in a Suspense boundary
// This avoids errors and shows a fallback UI while the client-side search params are being read.
export default function StartExercisePage() {
  return (
    <Suspense
      fallback={<div className="text-center p-6">Loading Exercise...</div>}
    >
      <StartExercise />
    </Suspense>
  );
}

function StartExercise() {
  // 2. UPDATED HOOKS: Get router for navigation and searchParams for query data
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [answer, setAnswer] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [qnsType, setQnsType] = useState<string | null>(null);
  const [qnsData, setQnsData] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // No changes needed for timer logic, formatTime, pauseTimer, startTimer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!isPaused) startTimer();
    else pauseTimer();
    return pauseTimer;
  }, [isPaused]);

  // 3. REFACTORED useEffect: No more router.isReady. We use searchParams directly.
  useEffect(() => {
    if (hasFetched) {
      console.warn("Already fetched exercise data, skipping initialization.");
      return; // Prevent multiple fetches
    }
    const initExerciseSession = async () => {
      // Get the 'data' parameter from the URL query string
      setHasFetched(true);
      const data = searchParams.get("data");

      if (!data || typeof data !== "string") {
        setError("No exercise data provided or data is in an invalid format.");
        setLoading(false);
        return;
      }

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

        // The initial fetch to start the session
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/start-session/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            group_name,
            exercise_names,
            console_played_entered,
          }),
        });

        // The second fetch to get the first question
        await fetchQuestion(group_name, exercise_names);
      } catch (err) {
        console.error(err);
        setError("Failed to start session or load question.");
        setLoading(false);
      }
    };

    initExerciseSession();
    // The effect now depends on searchParams
  }, [searchParams,hasFetched]);

  // No changes needed for fetchQuestion, handleSubmit, handleSkip, etc.
  // ... (all your handler functions: fetchQuestion, handleSubmit, handleSkip, handlePauseToggle, handleStop)
  // These functions are omitted here for brevity but should be included in your final file.
 const fetchQuestion = async (
    group_name: string,
    exercise_names: string[]
  ) => {
    try {
      // --- MOCK START ---
      
      // 1. Define your fake data for the clock question
      // const mockData = {
      //   question: "",
      //   type: "clock",
      //   qns: "3:20"
      // };

      // // 2. Simulate a network delay (e.g., 500ms)
      // await new Promise(resolve => setTimeout(resolve, 500));
      
      // // 3. Set state using the mock data
      // setQuestion(mockData);
      // setQnsType(mockData.type || null);
      // setQnsData(mockData.qns || null);
      // setAnswer("");
      // setTimer(0);
      // setIsPaused(false);

      // --- MOCK END ---


      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/exercise/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            group_name,
            exercise_names,
            console_played_entered: "0",
          }),
        }
      );

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Error loading question");

      setQuestion(data);
      setGroupName(group_name || null);
      setQnsType(data.type || null);
      setQnsData(data.qns || null);
      
      setAnswer("");
      setTimer(0);
      setIsPaused(false);
      

    } catch (err) {
      console.error(err);
      setError("Failed to fetch question.");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/exercise/submit/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ type: "submit", a: answer }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setQuestion({ question: data.question });
      setAnswer("");
      setTimer(0);
      setIsPaused(false);

      if (data.redirect) router.push("/Dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to submit answer.");
    }
  };

  const handleSkip = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/exercise/submit/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ type: "skip" }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to skip");

      setQuestion({ question: data.question });
      setAnswer("");
      setTimer(0);
      setIsPaused(false);
    } catch (err) {
      console.error(err);
      setError("Failed to skip question.");
    }
  };

  const handlePauseToggle = async () => {
    const type = isPaused ? "resume" : "pause";
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/exercise/submit/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type }),
      });
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
          <div className="my-6 flex justify-center items-center">
            {/* You're passing question.question here, which is fine */}
            <Clock time={question?.question || "00:00"} />
          </div>
        );

      case "shape":
        return (
          <div className="my-6 flex justify-center items-center">
           <ShapeComponent shape={question?.question || null} />
            
          </div>
        );

      case "stick":
        return (
          <div className="my-6 flex justify-center items-center">
           
          </div>
        );

      // Add more cases as needed...

      default:
        // Return nothing if no group matches
        return <p className="font-semibold">
              Q: <InlineMath math={question?.question || question?.text || ""} />
            </p>;
    }
  };
  return (
    // The JSX for rendering your component remains the same
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="relative bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Start Exercise</h1>

        {loading && <p>Loading your session...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && question && (
          <div className="space-y-4">
            <div className="text-right text-sm text-gray-600 font-mono">
              ⏱ {formatTime(timer)}
            </div>
           

            {/* --- THIS IS THE NEW BLOCK --- */}
            {/* Check if type is 'clock' and qnsData has a value */}
           {renderDynamicContent()}
            {/* --- END OF NEW BLOCK --- */}

            {question.options && (
              <ul className="space-y-2">
                {question.options.map((opt: string, idx: number) => (
                  <li key={idx} className="bg-gray-100 p-2 rounded">
                    {opt}
                  </li>
                ))}
              </ul>
            )}

            <textarea
              className="w-full border p-2 rounded mt-2"
              rows={4}
              placeholder="Write your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
    // Check if the Enter key was pressed and the exercise is not paused
    if (e.key === 'Enter' && !isPaused) {
      e.preventDefault(); // Prevents a new line from being added
      handleSubmit();
    }
  }}
            />

          <div className="flex flex-wrap items-center justify-center cursor-pointer gap-3 mt-4">
    {isPaused ? (
      <p className="text-gray-500 font-semibold">Please resume to continue</p>
    ) : (
      <button
        onClick={handleSubmit}
        className="px-4 py-2 cursor-pointer hover:scale-110 transition duration-300 bg-gradient-to-r from-green-500 to-green-700 text-white rounded hover:bg-green-700"
      >
        Submit
      </button>
    )}
  </div>
          </div>
        )}

        {/* Right-bottom control buttons */}
      
<div
  className="absolute 
-bottom-14 left-1/2 -translate-x-1/2 
sm:bottom-2 sm:-right-14 sm:left-auto sm:translate-x-0 
flex gap-3 
flex-row sm:flex-col"
>
  <button
    onClick={handlePauseToggle}
    className="group flex items-center cursor-pointer justify-center h-10 w-10 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
  >
    {isPaused ? (
      <GrResume className="text-gray-400 text-base transition-transform duration-400" />
    ) : (
      <FaPause className="text-gray-400 text-base transition-transform duration-400" />
    )}
  </button>
  {isPaused === false && (
    <button
      onClick={handleSkip}
      className="group flex items-center cursor-pointer justify-center h-10 w-10 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
    >
      <IoMdSkipForward className="text-gray-400 text-base transition-transform duration-600" />
    </button>
  )}
  <button
    onClick={handleStop}
    className="group flex items-center cursor-pointer justify-center h-10 w-10 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
  >
    <FaStop className="text-gray-400 text-base transition-transform duration-400" />
  </button>
</div>
      </div>
    </div>
  );
}
