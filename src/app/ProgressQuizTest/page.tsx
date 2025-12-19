"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import api from "../../utility/axiosInstance";
import { FaHistory, FaCheckCircle, FaTimesCircle, FaClock, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// --- Types ---

interface HistoryItem {
  id: number;
  assessment_type: "QUIZ" | "TEST";
  start_time: string;
  end_time: string | null;
  total_questions: number;
  score: number;
  is_completed: boolean;
  time_taken: number;
}

interface HistoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: HistoryItem[];
}

interface QuestionDetail {
  id: number;
  sequence_number: number;
  group_name: string;
  exercise_name: string;
  question_text: string;
  user_response: string | null;
  is_attempted: boolean;
}

interface AssessmentDetail extends HistoryItem {
  items: QuestionDetail[];
}

// --- Components ---

export default function QuizProgressPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<"ALL" | "QUIZ" | "TEST">("ALL");
  
  // Detail Modal State
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailData, setDetailData] = useState<AssessmentDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // --- Fetch History List ---
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/assessments/history/?page=${page}`);
        const data: HistoryResponse = res.data;
        
        setHistory(data.results);
        // Assuming default page size of 10 or 20 from your count
        setTotalPages(Math.ceil(data.count / 20)); 
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [page]);

  // --- Fetch Single Detail ---
  const handleCardClick = async (id: number) => {
    setSelectedId(id);
    setLoadingDetail(true);
    setDetailData(null); // Reset previous data

    try {
      const res = await api.get(`/assessments/history/${id}/`);
      setDetailData(res.data);
    } catch (err) {
      console.error("Failed to fetch details", err);
      alert("Could not load details.");
      setSelectedId(null); // Close modal on error
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDetail = () => {
    setSelectedId(null);
    setDetailData(null);
  };

  // --- Helpers ---
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return "0s";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
  };

  // Filter Logic (Client-side filtering for display, API for pagination)
  // Note: Ideally API should handle filtering, but if API returns mixed, we filter here.
  const filteredHistory = history.filter(item => 
    filter === "ALL" ? true : item.assessment_type === filter
  );

  return (
    <div className="min-h-screen bg-yellow-50 p-4 mt-20 font-sans">
      
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tighter">
            History 📜
          </h1>
          <p className="text-gray-600 font-medium">Your past quizzes and tests</p>
        </div>
        <Link href="/progress" className="text-sm font-bold border-b-2 border-black hover:text-blue-600">
          &larr; Back
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-2xl mx-auto mb-6 flex gap-2">
        {(["ALL", "QUIZ", "TEST"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
              ${filter === type ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"}`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* List Container */}
      <div className="max-w-2xl mx-auto space-y-4">
        {loading ? (
          <div className="text-center py-10 font-bold text-gray-500">Loading records...</div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-400 rounded bg-white">
            No records found.
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div 
              key={item.id}
              onClick={() => handleCardClick(item.id)}
              className="group cursor-pointer bg-white border-4 border-black p-4 relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-1 text-xs font-black text-white uppercase ${item.assessment_type === 'TEST' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                  {item.assessment_type}
                </span>
                <span className="text-xs font-bold text-gray-500">
                  {formatDate(item.start_time)}
                </span>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="text-4xl font-black text-black leading-none">
                    {item.score}<span className="text-lg text-gray-400">/{item.total_questions}</span>
                  </div>
                  <div className="text-xs font-bold text-gray-600 mt-1 flex items-center gap-1">
                    <FaClock /> {formatDuration(item.time_taken)}
                  </div>
                </div>
                
                <div className="text-right">
                  {item.is_completed ? (
                    <span className="text-green-600 font-bold flex items-center gap-1">
                      <FaCheckCircle /> Done
                    </span>
                  ) : (
                    <span className="text-orange-500 font-bold flex items-center gap-1">
                      <FaHistory /> Incomplete
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="max-w-2xl mx-auto mt-8 flex justify-between items-center">
        <button 
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          className="p-3 bg-white border-2 border-black disabled:opacity-50 hover:bg-gray-100"
        >
          <FaChevronLeft />
        </button>
        <span className="font-bold">Page {page} of {totalPages}</span>
        <button 
          disabled={page >= totalPages}
          onClick={() => setPage(p => p + 1)}
          className="p-3 bg-white border-2 border-black disabled:opacity-50 hover:bg-gray-100"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* --- DETAIL MODAL --- */}
      {selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border-4 border-black w-full max-w-lg max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b-4 border-black bg-yellow-100">
              <h2 className="text-xl font-black uppercase">Result Details</h2>
              <button 
                onClick={closeDetail}
                className="w-8 h-8 flex items-center justify-center bg-red-500 text-white font-bold border-2 border-black hover:bg-red-600"
              >
                X
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto bg-gray-50 flex-1">
              {loadingDetail ? (
                <div className="text-center py-10 font-bold animate-pulse">Fetching details...</div>
              ) : detailData ? (
                <div className="space-y-4">
                  {/* Summary Banner inside Modal */}
                  <div className="bg-white border-2 border-black p-4 flex justify-around text-center mb-6">
                    <div>
                      <div className="text-gray-500 text-xs font-bold uppercase">Score</div>
                      <div className="text-2xl font-black text-blue-600">{detailData.score}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs font-bold uppercase">Time</div>
                      <div className="text-2xl font-black text-purple-600">{formatDuration(detailData.time_taken)}</div>
                    </div>
                  </div>

                  {/* Question List */}
                  {detailData.items.map((q, idx) => (
                    <div key={q.id} className="bg-white border-2 border-gray-200 p-4 rounded shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-400">#{idx + 1}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-200 rounded-full text-gray-600">
                          {q.exercise_name}
                        </span>
                      </div>
                      
                      <div className="text-lg font-bold text-center py-2 mb-3 bg-gray-50 rounded">
                        {/* Rendering Math */}
                        <InlineMath math={q.question_text || ""} />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-gray-500">Your Answer:</span>
                        <span className={`px-3 py-1 font-bold rounded border-2 ${
                          q.user_response 
                            ? "bg-blue-50 border-blue-200 text-blue-700" 
                            : "bg-gray-100 border-gray-300 text-gray-400"
                        }`}>
                          {q.user_response || "Skipped"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-red-500 font-bold">Failed to load content.</div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}