"use client";

import Link from "next/link";
import { useAuth } from "../../context/Authcontext";

import { useTranslations } from "next-intl";

export default function Dashboard() {
  const { user, loading } = useAuth();
  
  

  // language
  const t = useTranslations("Dashboard");

  // Fetch data (Admin Only)
 


  if (loading) {
    return <div className="p-10 text-center">{t('loading')}</div>;
  }

  // ==========================================
  // ✅ 1. Admin Dashboard (Updated Layout)
  // ==========================================
 

  // ==========================================
  // ✅ 2. Normal User Dashboard
  // ==========================================
  return (
    <div className="min-h-screen mt-10 flex flex-col items-center bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
         {t('welcomeMessage')} 
        </h1>
        <p className="text-gray-600 mt-2">
          {t('selectMode')}
        </p>
      </div>

      {/* Grid updated to accommodate 4 items: 2x2 on medium, 4x1 on large */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl px-4">
        
        {/* CARD 1: EXERCISES */}
        <Link 
          href="/Exercise" 
          className="group relative bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
            📚
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('cardExercisesTitle')}</h2>
          <p className="text-gray-500">
            {t('cardExercisesDesc')}
          </p>
          <span className="mt-6 text-blue-600 font-semibold group-hover:underline">{t('cardExercisesBtn')}&rarr;</span>
        </Link>

        {/* CARD 2: QUIZ */}
        <Link 
          href="/Quiz" 
          className="group relative bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:bg-green-600 group-hover:text-white transition-colors">
            🧠
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('cardQuizTitle')}</h2>
          <p className="text-gray-500">
            {t('cardQuizDesc')}
          </p>
          <span className="mt-6 text-green-600 font-semibold group-hover:underline">{t('cardQuizBtn')} &rarr;</span>
        </Link>

        {/* CARD 3: TEST */}
        <Link 
          href="/Test" 
          className="group relative bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
            ⏱️
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('cardTestTitle')}</h2>
          <p className="text-gray-500">
            {t('cardTestDesc')}
          </p>
          <span className="mt-6 text-purple-600 font-semibold group-hover:underline">{t('cardTestBtn')} &rarr;</span>
        </Link>

        {/* CARD 4: COLORING (NEW) */}
        <Link 
          href="/Coloring" 
          className="group relative bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:bg-pink-600 group-hover:text-white transition-colors">
            🎨
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('cardColoringTitle') || "Coloring"}</h2>
          <p className="text-gray-500">
            {t('cardColoringDesc') || "Unleash your creativity with colors."}
          </p>
          <span className="mt-6 text-pink-600 font-semibold group-hover:underline">{t('cardColoringBtn') || "Start Coloring"} &rarr;</span>
        </Link>

        {/* CARD 5: GAME (NEW) */}
        <Link 
          href="/Game" 
          className="group relative bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4 text-2xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
            🎮
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('cardGameTitle') || "Games"}</h2>
          <p className="text-gray-500">
            {t('cardGameDesc') || "Play fun games while learning."}
          </p>
          <span className="mt-6 text-orange-600 font-semibold group-hover:underline">{t('cardGameBtn') || "Play Now"} &rarr;</span>
        </Link>
      </div>
    </div>
  );
}