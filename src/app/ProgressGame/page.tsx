"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../utility/axiosInstance"; // Adjust path to your axios instance
import { 
  FaGamepad, 
  FaCalendarAlt, 
  FaClock, 
  FaChevronDown, 
  FaChevronUp, 
  FaCheckCircle, 
  FaTimesCircle,
  FaArrowLeft
} from "react-icons/fa";

// --- Types based on your JSON response ---
interface BallHistoryItem {
  number: number;
  spawnTime: string;
  endTime: string;
  reactionTimeMs: number;
  result: "CORRECT" | "WRONG";
  basketChosen: string;
}

interface GameInfo {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

interface GameSession {
  id: number;
  game: GameInfo;
  score: number;
  correct_moves: number;
  wrong_moves: number;
  missed_moves: number;
  duration_seconds: number;
  played_at: string;
  ball_history: BallHistoryItem[];
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: GameSession[];
}

export default function ProgressGame() {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSessionId, setExpandedSessionId] = useState<number | null>(null);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get<PaginatedResponse>("/games/sessions/");
        setSessions(response.data.results);
      } catch (error) {
        console.error("Failed to fetch game sessions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // --- toggle details ---
  const toggleExpand = (id: number) => {
    setExpandedSessionId(expandedSessionId === id ? null : id);
  };

  // --- Helpers ---
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAccuracy = (correct: number, wrong: number, missed: number) => {
    const total = correct + wrong + missed;
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  return (
    <div className="min-h-screen bg-purple-50 p-6 pt-24 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-2xl mb-8 flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
            Arcade History 🕹️
            </h1>
            <p className="text-gray-600 font-medium mt-1">
            Review your reflexes and high scores.
            </p>
        </div>
        <Link href="/Progress" className="bg-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all">
            <FaArrowLeft />
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-xl font-bold text-gray-500 animate-pulse">
          Loading Game Data...
        </div>
      )}

      {/* Empty State */}
      {!loading && sessions.length === 0 && (
        <div className="text-center p-10 border-4 border-gray-300 rounded-xl border-dashed">
            <p className="text-gray-400 font-bold text-lg">No games played yet.</p>
            <Link href="/Games" className="text-purple-600 underline mt-2 block">Go play something!</Link>
        </div>
      )}

      {/* Sessions List */}
      <div className="w-full max-w-2xl space-y-6">
        {sessions.map((session) => (
          <div 
            key={session.id} 
            className="bg-white border-4 border-black p-0 
                       shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                       transition-all duration-200"
          >
            {/* Card Main Content */}
            <div 
                className="p-6 cursor-pointer hover:bg-purple-50 transition-colors"
                onClick={() => toggleExpand(session.id)}
            >
                {/* Top Row: Game Name & Date */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 border-2 border-black">
                            <FaGamepad className="text-xl text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-black uppercase">{session.game.name}</h2>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                <FaCalendarAlt />
                                {formatDate(session.played_at)}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                         {/* Toggle Icon */}
                        {expandedSessionId === session.id ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                </div>

                {/* Stats Row */}
                <div className="flex justify-between items-end border-t-2 border-dashed border-gray-200 pt-4">
                    <div className="text-center">
                        <span className="block text-xs font-bold text-gray-400 uppercase">Score</span>
                        <span className="block text-3xl font-black text-purple-600">{session.score}</span>
                    </div>
                    
                    <div className="text-center border-l border-gray-200 pl-4">
                         <span className="block text-xs font-bold text-gray-400 uppercase">Accuracy</span>
                         <span className="block text-xl font-bold text-gray-800">
                            {getAccuracy(session.correct_moves, session.wrong_moves, session.missed_moves)}%
                         </span>
                    </div>

                    <div className="text-center border-l border-gray-200 pl-4">
                         <span className="block text-xs font-bold text-gray-400 uppercase">Duration</span>
                         <span className="flex items-center gap-1 text-xl font-bold text-gray-800">
                            <FaClock className="text-xs" />
                            {Math.round(session.duration_seconds)}s
                         </span>
                    </div>
                </div>
            </div>

            {/* Expanded Details: History Table */}
            {expandedSessionId === session.id && (
                <div className="bg-gray-50 border-t-4 border-black p-4 animate-in slide-in-from-top-2 duration-200">
                    <h3 className="text-sm font-black text-gray-500 uppercase mb-3 tracking-wider">Move History</h3>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-200 border-b-2 border-black">
                                <tr>
                                    <th className="px-3 py-2">Number</th>
                                    <th className="px-3 py-2">Choice</th>
                                    <th className="px-3 py-2">Speed</th>
                                    <th className="px-3 py-2 text-right">Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {session.ball_history.map((move, index) => (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-white">
                                        <td className="px-3 py-2 font-bold">{move.number}</td>
                                        <td className="px-3 py-2 text-gray-600">{move.basketChosen}</td>
                                        <td className="px-3 py-2 text-gray-500">{move.reactionTimeMs}ms</td>
                                        <td className="px-3 py-2 text-right">
                                            {move.result === "CORRECT" ? (
                                                <span className="inline-flex items-center gap-1 text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full text-xs border border-green-600">
                                                    <FaCheckCircle /> Correct
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded-full text-xs border border-red-600">
                                                    <FaTimesCircle /> Wrong
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 pb-10">
         <p className="text-gray-400 text-sm font-medium">Showing recent sessions</p>
      </div>
    </div>
  );
}