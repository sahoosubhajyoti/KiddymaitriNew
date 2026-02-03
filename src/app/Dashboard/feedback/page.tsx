"use client";
import React, { useEffect, useState } from "react";
// 1. Import your custom Axios instance instead of raw axios
import api from "../../../utility/axiosInstance"; 
import Link from "next/link";

// Define the interface based on your API structure
interface FeedbackItem {
  id: number;
  name: string;
  email: string;
  subject: string;
  review: number;
  body: string;
  created_at?: string;
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Fetch Feedback Data
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        // 2. Use 'api' instead of 'axios'. 
        // We removed `${process.env...}` because 'api' already has baseURL configured.
        const response = await api.get('/feedback/feedbacks/');
        
        setFeedbacks(response.data.results || []); 
      } catch (err) {
        console.error(err);
        // If it's a 401, the interceptor handles the redirect.
        // We sets error state just in case it's a different error (like 500).
        setError("Failed to load feedback.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // 2. Handle Delete Action
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;

    try {
      // 3. Use 'api.delete' here as well to ensure the user is authorized to delete
      await api.delete(`/feedback/feedbacks/${id}/`);
      
      // Optimistically remove the item from the UI
      setFeedbacks((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      // Again, 401s are handled by the interceptor, alerting for other errors
      alert("Failed to delete the item. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Feedback</h1>
          <p className="text-gray-500 mt-1">Manage and review all incoming user submissions.</p>
        </div>
        <Link 
          href="/Dashboard" 
          className="mt-4 md:mt-0 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors shadow-sm"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading feedback data...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">{error}</div>
        ) : feedbacks.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No feedback found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4 text-center">Review</th>
                  <th className="px-6 py-4 w-1/3">Message</th>
                  <th className="px-6 py-4 text-right">Date</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {feedbacks.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    {/* User Info Column */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <span className="text-sm text-gray-500">{item.email}</span>
                      </div>
                    </td>

                    {/* Subject Column */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {item.subject}
                      </span>
                    </td>

                    {/* Rating/Review Column */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.review >= 4 ? 'bg-green-100 text-green-800' :
                        item.review >= 3 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.review} / 5
                      </span>
                    </td>

                    {/* Message Body Column */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-2" title={item.body}>
                        {item.body}
                      </p>
                    </td>

                    {/* Date Column */}
                    <td className="px-6 py-4 text-right text-sm text-gray-400 whitespace-nowrap">
                      {item.created_at 
                        ? new Date(item.created_at).toLocaleDateString() 
                        : "N/A"}
                    </td>

                    {/* Action Column (Delete Button) */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete Feedback"
                      >
                        {/* Trash Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination Footer */}
        {!loading && feedbacks.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
            <span>Showing {feedbacks.length} results</span>
            <div className="flex gap-2">
              <button disabled className="px-3 py-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50">Previous</button>
              <button disabled className="px-3 py-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}