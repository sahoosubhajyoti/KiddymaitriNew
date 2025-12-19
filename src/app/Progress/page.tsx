"use client";

import Link from "next/link";
import { FaRunning, FaTrophy, FaArrowRight, FaChartLine } from "react-icons/fa";

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-yellow-50 p-6 mt-20 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-md mb-8">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
          Your Stats 📊
        </h1>
        <p className="text-gray-600 font-medium mt-1">
          Keep pushing your limits!
        </p>
      </div>

      {/* Cards Container */}
      <div className="w-full max-w-md space-y-6">

        {/* --- Card 1: Exercise Progress --- */}
        <Link href="/progress/exercise" className="block group">
          {/* FIX: Removed the inner absolute div. Added shadow-[...] utility class */}
          <div className="bg-white border-4 border-black p-6 
                          shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                          transition-all duration-200 
                          group-hover:-translate-y-1 group-hover:-translate-x-1 
                          group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            
            <div className="flex justify-between items-start">
              <div className="bg-blue-100 p-3 border-2 border-black inline-block mb-4">
                <FaRunning className="text-2xl text-blue-600" />
              </div>
              <FaArrowRight className="text-xl text-gray-400 group-hover:text-black transition-colors" />
            </div>

            <h2 className="text-2xl font-bold text-black mb-2">Exercise Progress</h2>
            <p className="text-gray-600 mb-4 text-sm font-medium">
              Track your daily practice streaks and topic mastery.
            </p>

            {/* Mini Stat Bar */}
            <div className="w-full bg-gray-200 h-4 border-2 border-black">
              <div 
                className="bg-blue-500 h-full border-r-2 border-black" 
                style={{ width: "65%" }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs font-bold text-gray-800">
              <span>Modules: 12/20</span>
              <span>65% Done</span>
            </div>
          </div>
        </Link>

        {/* --- Card 2: Quiz/Test Progress --- */}
        <Link href="/progress/quiz" className="block group">
          {/* FIX: Applied the same shadow fix here */}
          <div className="bg-white border-4 border-black p-6 
                          shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                          transition-all duration-200 
                          group-hover:-translate-y-1 group-hover:-translate-x-1 
                          group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            
            <div className="flex justify-between items-start">
              <div className="bg-green-100 p-3 border-2 border-black inline-block mb-4">
                <FaTrophy className="text-2xl text-green-600" />
              </div>
              <FaArrowRight className="text-xl text-gray-400 group-hover:text-black transition-colors" />
            </div>

            <h2 className="text-2xl font-bold text-black mb-2">Quiz & Test Results</h2>
            <p className="text-gray-600 mb-4 text-sm font-medium">
              View your assessment history, scores, and improvements.
            </p>

            {/* Mini Stat Badge */}
            <div className="flex gap-3">
                <div className="flex-1 bg-gray-50 border-2 border-black p-2 text-center">
                    <span className="block text-xs text-gray-500 font-bold uppercase">Avg Score</span>
                    <span className="block text-xl font-black text-green-600">82%</span>
                </div>
                <div className="flex-1 bg-gray-50 border-2 border-black p-2 text-center">
                    <span className="block text-xs text-gray-500 font-bold uppercase">Tests Taken</span>
                    <span className="block text-xl font-black text-black">14</span>
                </div>
            </div>
          </div>
        </Link>

        {/* Back Link */}
        <div className="text-center mt-8 pb-10">
            <Link href="/Dashboard" className="text-black font-bold border-b-2 border-black hover:bg-yellow-200 transition-colors">
                &larr; Back to Dashboard
            </Link>
        </div>

      </div>
    </div>
  );
}