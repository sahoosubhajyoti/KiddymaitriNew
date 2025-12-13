"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/Authcontext";
import api from "../../utility/axiosInstance"; 

// Note: The ApiData interface for exercises is removed here 
// because that data fetching will happen on the new /exercise page.

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Admin State
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [open, setOpen] = useState(false);

  // Fetch data (Admin Only)
  useEffect(() => {
    if (user?.type === "admin") {
      api.get('/analytics/metadata/users')
        .then((response) => {
          setTotalUsers(response.data.total_users || 0);
        })
        .catch((err) => {
          console.error("Error fetching metadata:", err);
        });
    }
    // We removed the User fetch here because that logic 
    // moves to the specific pages (Exercise/Quiz/Test)
  }, [user?.type]);


  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // ==========================================
  // ✅ 1. Admin Dashboard (Unchanged)
  // ==========================================
  if (user?.type === "admin") {
    return (
      <div className="min-h-[60vh] mt-14 bg-gray-100 p-6 space-y-4">
        <div className="rounded-lg p-4 flex justify-around items-center">
          <h1 className="text-4xl font-bold mb-4 underline-offset-8 underline">
            Admin Dashboard
          </h1>
          <Link
            href="/Dashboard/export"
            className="bg-red-600 text-white px-4 py-3 rounded hover:bg-red-700"
          >
            Export Data
          </Link>
        </div>

        {/* User Activity Metadata */}
        <div className="bg-white shadow rounded-lg p-4 flex justify-between">
          <span>User Activity Metadata</span>
          <Link
            href="/Dashboard/users"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Get Report
          </Link>
        </div>

        {/* Question Performance */}
        <div className="bg-white shadow rounded-lg p-4 flex justify-between">
          <span>Question Performance</span>
          <Link
            href="/Dashboard/questions"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Get Report
          </Link>
        </div>

        {/* Time-Based Analytics */}
        <div className="bg-white shadow rounded-lg p-4 flex justify-between">
          <span>Time-Based Analytics</span>
          <Link
            href="/Dashboard/daily"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Get Report
          </Link>
        </div>

        {/* Single User Activity with dropdown */}
        <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
          <span className="font-semibold">Single User Activity</span>
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Get Report
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {totalUsers > 0 ? (
                  Array.from({ length: totalUsers }, (_, i) => i + 1).map(
                    (id) => (
                      <Link
                        key={id}
                        href={`/Dashboard/user/${id}`}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        User {id}
                      </Link>
                    )
                  )
                ) : (
                  <p className="px-4 py-2 text-gray-500">No users found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ✅ 2. Normal User Dashboard (New 3-Card Layout)
  // ==========================================
  return (
    <div className="min-h-screen mt-10 flex flex-col items-center bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.name || "User"}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Select a mode to continue your learning journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4">
        
        {/* CARD 1: EXERCISES (Redirects to your existing logic) */}
        <Link 
          href="/Exercise" 
          className="group relative bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
            📚
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Exercises</h2>
          <p className="text-gray-500">
            Browse categories and practice specific coding challenges at your own pace.
          </p>
          <span className="mt-6 text-blue-600 font-semibold group-hover:underline">Start Practice &rarr;</span>
        </Link>

        {/* CARD 2: QUIZ */}
        <Link 
          href="/Quiz" 
          className="group relative bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:bg-green-600 group-hover:text-white transition-colors">
            🧠
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz</h2>
          <p className="text-gray-500">
            Test your knowledge with quick-fire questions and instant feedback.
          </p>
          <span className="mt-6 text-green-600 font-semibold group-hover:underline">Take a Quiz &rarr;</span>
        </Link>

        {/* CARD 3: TEST */}
        <Link 
          href="/Test" 
          className="group relative bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
            ⏱️
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Test</h2>
          <p className="text-gray-500">
            Simulate a real exam environment with timed assessments.
          </p>
          <span className="mt-6 text-purple-600 font-semibold group-hover:underline">Start Test &rarr;</span>
        </Link>

      </div>
    </div>
  );
}