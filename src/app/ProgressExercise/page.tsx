"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // 1. Import SearchParams
import { useAuth } from "../../context/Authcontext"; // 2. Import Auth Context
import api from "../../utility/axiosInstance";
import { FaClock, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaDumbbell } from "react-icons/fa";

// --- Interfaces ---
interface ProgressEntry {
  "S.No.": number;
  Date: string;
  Exercise: string;
  Questions: number;
  Skipped: number;
  Correct_Attempts: number;
  Incorrect_Attempts: number;
  Total_time: number;
}

interface ApiResponse {
  data: ProgressEntry[];
}

export default function ExerciseProgressPage() {
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. Get Auth and URL Params
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  console.log(userId,"exercise");

  // --- 1. Fetch Data ---
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        let endpoint = '/data/'; // Default for normal user

        // 4. Logic to switch API if Admin is viewing a specific user
        if (user?.type === "admin" && userId) {
             endpoint = `/assessments/admin/history/${userId}/`;
        }

        const res = await api.get(endpoint);
        const json: ApiResponse = res.data;
        
        // Ensure we set an array, even if API returns null/undefined
        setProgress(json.data || []);
      } catch (err) {
        console.error("Failed to load progress data", err);
      } finally {
        setLoading(false);
      }
    };

    // Only run fetch if we know the user type (wait for auth to load)
    if (user) {
        fetchProgress();
    }
  }, [user, userId]); // Re-run if user or userId changes

  // --- Helper: Format Seconds ---
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
    "Qns",
    "Skip",
    "Correct",
    "Wrong",
    "Time",
  ];

  // Helper for Back Link
  const backLink = user?.type === "admin" && userId 
    ? `/Progress?userId=${userId}` 
    : "/Progress";

  return (
    <div className="min-h-screen bg-yellow-50 p-4 md:p-8 pt-24 font-sans">
      
      {/* --- Header --- */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tighter flex items-center gap-2">
            {user?.type === "admin" && userId ? `User ${userId} Exercise Log` : "Exercise Log"} 
            <FaDumbbell className="text-blue-600"/>
          </h1>
          <p className="text-gray-600 font-medium">Tracking daily practice details</p>
        </div>
        <Link href={backLink} className="text-sm font-bold border-b-2 border-black hover:text-blue-600 transition-colors">
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
                      <div className="font-bold text-black">{entry.Date}</div>
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
                    <span>Questions: {entry.Questions} (Skip: {entry.Skipped})</span>
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
                      <td className="px-6 py-4 font-bold whitespace-nowrap">{entry.Date}</td>
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