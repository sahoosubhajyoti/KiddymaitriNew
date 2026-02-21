"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/Authcontext";
import api from "../../utility/axiosInstance"; 
import { useTranslations } from "next-intl";

export default function Dashboard() {
  const { user, loading } = useAuth();
  
  // Admin State
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [open, setOpen] = useState(false);

  // language
  const t = useTranslations("Dashboard");

  // Fetch data (Admin Only)
  useEffect(() => {
    if (user?.type === "admin") {
      api.get('/exercise-analysis/metadata/users')
        .then((response) => {
          setTotalUsers(response.data.total_users || 0);
        })
        .catch((err) => {
          console.error("Error fetching metadata:", err);
        });
    }
  }, [user?.type]);


  if (loading) {
    return <div className="p-10 text-center">{t('loading')}</div>;
  }

  // ==========================================
  // ✅ 1. Admin Dashboard (Updated Layout)
  // ==========================================
  if (user?.type === "admin") {
    return (
      <div className="min-h-screen mt-14 bg-gray-50 p-8">
        
        {/* Header: Separated at both ends */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-200">
          <h1 className="text-4xl font-bold text-gray-800 underline-offset-8 underline decoration-blue-600">
            {t('adminDashboard')}
          </h1>
          
        </div>

        {/* Grid Menu: Follows the same card style as User Dashboard */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1: All User Data Table (New) */}
            <Link 
              href="/Dashboard/all-users" 
              className="group bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                🗂️
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">All Registered Users</h2>
              <p className="text-gray-500 text-sm">View and manage table of all registered users.</p>
              <span className="mt-4 text-blue-600 font-semibold group-hover:underline">View Table &rarr;</span>
            </Link>

            {/* Card 2: User Activity Report */}
            <Link 
              href="/Dashboard/users" 
              className="group bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                👥
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t('userActivity')}</h2>
              <p className="text-gray-500 text-sm">Analyze user engagement and activity reports.</p>
              <span className="mt-4 text-green-600 font-semibold group-hover:underline">{t('getReport')} &rarr;</span>
            </Link>

            {/* Card 3: Question Performance */}
            <Link 
              href="/Dashboard/questions" 
              className="group bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                📊
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t('questionPerformance')}</h2>
              <p className="text-gray-500 text-sm">See how users perform on specific questions.</p>
              <span className="mt-4 text-purple-600 font-semibold group-hover:underline">{t('getReport')} &rarr;</span>
            </Link>

            {/* Card 4: Time Analytics */}
            <Link 
              href="/Dashboard/daily" 
              className="group bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
                ⏳
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t('timeAnalytics')}</h2>
              <p className="text-gray-500 text-sm">Track time usage and session duration trends.</p>
              <span className="mt-4 text-orange-600 font-semibold group-hover:underline">{t('getReport')} &rarr;</span>
            </Link>

           <Link 
  href="/Dashboard/feedback" 
  className="group bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center"
>
  <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
    💬
  </div>
  <h2 className="text-xl font-bold text-gray-800 mb-2">User Feedback</h2>
  <p className="text-gray-500 text-sm">View and manage user reviews and suggestions.</p>
  <span className="mt-4 text-teal-600 font-semibold group-hover:underline">View All &rarr;</span>
</Link>
<Link 
              href="/AddExercise" 
              className="group bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                🗂️
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Add Exercises</h2>
              <p className="text-gray-500 text-sm">Add Exercises.</p>
              <span className="mt-4 text-blue-600 font-semibold group-hover:underline">Add Exercises &rarr;</span>
            </Link>
            <Link 
              href="/AddPictures" 
              className="group bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                🗂️
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Add Pictures</h2>
              <p className="text-gray-500 text-sm">Add Pictures.</p>
              <span className="mt-4 text-blue-600 font-semibold group-hover:underline">Add Pictutes &rarr;</span>
            </Link>
            <Link 
              href="/AddMcq" 
              className="group bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                🗂️
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Add Mcq</h2>
              <p className="text-gray-500 text-sm">Add Mcq.</p>
              <span className="mt-4 text-blue-600 font-semibold group-hover:underline">Add Mcq &rarr;</span>
            </Link>

            {/* Card 5: Single User (Dropdown) */}
            <div className="group relative bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
                👤
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t('singleUserActivity')}</h2>
              <p className="text-gray-500 text-sm mb-4">Select a specific user ID to view details.</p>
              
              <div className="relative w-full">
                <button
                  onClick={() => setOpen(!open)}
                  className="w-full bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
                >
                  {open ? "Close List" : t('getReport')}
                </button>

                {open && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto text-left">
                    {totalUsers > 0 ? (
                      Array.from({ length: totalUsers }, (_, i) => i + 1).map((id) => (
                        <Link
                          key={id}
                          href={`/Dashboard/user/${id}`}
                          className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                        >
                          {t('user')} {id}
                        </Link>
                      ))
                    ) : (
                      <p className="px-4 py-2 text-gray-500">No users found</p>
                    )}
                  </div>
                )}
              </div>
            </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // ✅ 2. Normal User Dashboard
  // ==========================================

}