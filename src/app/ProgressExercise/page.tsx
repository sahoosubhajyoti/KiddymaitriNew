"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../context/Authcontext";
import api from "../../utility/axiosInstance";
import { FaClock, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaDumbbell } from "react-icons/fa";

// --- Interfaces ---

// 1. Existing UI Interface
interface ProgressEntry {
  "S.No."?: number; // Made optional as we might generate it dynamically or ignore it
  Date: string;
  Exercise: string;
  Questions: number;
  Skipped: number;
  Correct_Attempts: number;
  Incorrect_Attempts: number;
  Total_time: number; // In seconds
}

interface ApiResponse {
  data: ProgressEntry[];
}

// 2. New Interface for MCQ API Data
interface McqHistoryItem {
  id: number;
  date: string;
  chapter_name: string;
  total_questions: number;
  skipped_questions: number;
  correct_answers: number;
  wrong_answers: number;
  total_time: string; // "HH:MM:SS" or "In Progress"
  is_completed: boolean;
}

interface McqApiResponse {
  results: McqHistoryItem[];
}

export default function ExerciseProgressPage() {
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  // --- Helper: Convert "HH:MM:SS" to Seconds ---
  const parseTimeStringToSeconds = (timeStr: string): number => {
    if (!timeStr || timeStr === "In Progress") return 0;
    
    const parts = timeStr.split(":").map(Number);
    if (parts.length === 3) {
      // HH:MM:SS
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  // --- Fetch Data ---
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);

        // 1. Determine Endpoints
        let exerciseEndpoint = "/data/"; // Default exercise endpoint
        const mcqEndpoint = "/mcq/user/history"; // New MCQ endpoint

        // Admin logic for specific user (Only applies to exercise endpoint based on your logic)
        // If there is an admin endpoint for MCQs, update it here similarly.
        if (user?.type === "admin" && userId) {
          exerciseEndpoint = `/assessments/admin/history/${userId}/`;
        }

        // 2. Fetch Both APIs in Parallel
        const [exerciseRes, mcqRes] = await Promise.allSettled([
          api.get(exerciseEndpoint),
          api.get(mcqEndpoint)
        ]);

        let combinedData: ProgressEntry[] = [];

        // 3. Process Exercise Data
        if (exerciseRes.status === "fulfilled") {
          const json: ApiResponse = exerciseRes.value.data;
          if (Array.isArray(json.data)) {
            combinedData = [...json.data];
          }
        } else {
          console.error("Failed to fetch exercises", exerciseRes.reason);
        }

        // 4. Process MCQ Data & Normalize to ProgressEntry format
        if (mcqRes.status === "fulfilled") {
          const json: McqApiResponse = mcqRes.value.data;
          if (Array.isArray(json.results)) {
            const normalizedMcqs: ProgressEntry[] = json.results.map((item) => ({
              Date: item.date, // You might want to format this date string to match the other API
              Exercise: "MCQ", // Requirement: Show "MCQ" instead of chapter name
              Questions: item.total_questions,
              Skipped: item.skipped_questions,
              Correct_Attempts: item.correct_answers,
              Incorrect_Attempts: item.wrong_answers,
              Total_time: parseTimeStringToSeconds(item.total_time),
            }));
            combinedData = [...combinedData, ...normalizedMcqs];
          }
        } else {
          console.error("Failed to fetch MCQ history", mcqRes.reason);
        }

        // 5. Sort by Date (Descending) so newest are top
        combinedData.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());

        setProgress(combinedData);
      } catch (err) {
        console.error("Unexpected error loading progress data", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProgress();
    }
  }, [user, userId]);

  // --- Helper: Format Seconds to Human Readable ---
  const formatTime = (seconds: number) => {
    if (!seconds) return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const headers = [
    "Date",
    "Exercise",
    "Total Qns",
    "Total Skip",
    "Total Correct",
    "Total Wrong",
    "Total Time",
  ];

  const backLink = user?.type === "admin" && userId ? `/Progress?userId=${userId}` : "/Progress";

  return (
    <div className="min-h-screen bg-yellow-50 p-4 md:p-8 pt-24 mt-24 font-sans">
      {/* --- Header --- */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tighter flex items-center gap-2">
            {user?.type === "admin" && userId ? `User ${userId} Exercise Log` : "Exercise Log"}
            <FaDumbbell className="text-blue-600" />
          </h1>
          <p className="text-gray-600 font-medium">Tracking daily practice details</p>
        </div>
        <Link
          href={backLink}
          className="text-sm font-bold border-b-2 border-black hover:text-blue-600 transition-colors"
        >
          &larr; Back to Stats
        </Link>
      </div>

      {/* --- Content --- */}
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-12 font-bold text-gray-500 animate-pulse">Loading data...</div>
        ) : progress.length === 0 ? (
          <div className="text-center py-12 border-4 border-dashed border-gray-300 rounded-lg bg-white">
            <p className="text-xl font-bold text-gray-400">No exercise data found.</p>
          </div>
        ) : (
          <>
            {/* === MOBILE VIEW (Cards) === */}
            <div className="md:hidden space-y-4">
              {progress.map((entry, index) => (
                <div
                  key={index}
                  className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start border-b-2 border-gray-100 pb-2">
                    <div>
                      <span className="text-xs font-black uppercase text-gray-400">Exercise</span>
                      <div className="text-xl font-black text-blue-600">{entry.Exercise}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-400 flex items-center justify-end gap-1">
                        <FaCalendarAlt /> Date
                      </span>
                      {/* Truncate date if it's long ISO string */}
                      <div className="font-bold text-black">{new Date(entry.Date).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-2 border-2 border-green-100 rounded">
                      <span className="text-xs font-bold text-green-600 uppercase flex items-center gap-1">
                        <FaCheckCircle /> Correct
                      </span>
                      <span className="text-lg font-black text-gray-800">{entry.Correct_Attempts}</span>
                    </div>
                    <div className="bg-red-50 p-2 border-2 border-red-100 rounded">
                      <span className="text-xs font-bold text-red-500 uppercase flex items-center gap-1">
                        <FaTimesCircle /> Wrong
                      </span>
                      <span className="text-lg font-black text-gray-800">{entry.Incorrect_Attempts}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm font-bold text-gray-500 pt-2">
                    <span>
                      Questions: {entry.Questions} (Skip: {entry.Skipped})
                    </span>
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded border border-gray-300 text-black">
                      <FaClock /> {formatTime(entry.Total_time)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* === DESKTOP VIEW (Table) === */}
            <div className="hidden md:block overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <table className="min-w-full text-sm bg-white">
                <thead className="bg-black text-white">
                  <tr>
                    {headers.map((header) => (
                      <th key={header} className="px-6 py-4 font-black uppercase tracking-wider text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-200">
                  {progress.map((entry, index) => (
                    <tr key={index} className="hover:bg-yellow-50 transition-colors">
                      <td className="px-6 py-4 font-bold whitespace-nowrap">
                         {/* Simple formatting to handle mixed date strings */}
                        {new Date(entry.Date).toLocaleDateString()} <span className="text-xs text-gray-400 block">{new Date(entry.Date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </td>
                      <td className="px-6 py-4 font-black text-blue-600 uppercase">{entry.Exercise}</td>
                      <td className="px-6 py-4 font-medium">{entry.Questions}</td>
                      <td className="px-6 py-4 font-medium text-gray-400">{entry.Skipped}</td>
                      <td className="px-6 py-4 font-bold text-green-600">{entry.Correct_Attempts}</td>
                      <td className="px-6 py-4 font-bold text-red-500">{entry.Incorrect_Attempts}</td>
                      <td className="px-6 py-4 font-bold font-mono text-gray-700">
                        {formatTime(entry.Total_time)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}