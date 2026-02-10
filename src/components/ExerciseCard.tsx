"use client";

import React from "react";

interface ExerciseCardProps {
  category: string;
  imageSrc: string;
  onClick: () => void;
}

export default function ExerciseCard({
  category,
  imageSrc,
  onClick,
}: ExerciseCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative w-full aspect-[4/5] min-h-[280px] rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden border-4 border-white hover:border-blue-300 flex flex-col justify-end"
    >
      {/* 1. BACKGROUND IMAGE LAYER */}
      {/* This fills the entire card and sits behind everything (-z-10) */}
      <div className="absolute inset-0 bg-gray-100">
        <img
          src={imageSrc}
          alt={category}
          className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
             // Fallback color if image fails
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Gradient Overlay: Makes text readable even on busy images */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/5 to-transparent"></div>
      </div>

      {/* 2. CONTENT LAYER */}
      {/* This sits on top (relative z-10) and is pushed to bottom by flex-col justify-end */}
      <div className="relative z-10 p-5 text-center">
        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-wide drop-shadow-sm group-hover:text-blue-600 transition-colors">
          {category}
        </h2>
        
        <div className="mt-3">
          <span className="inline-block px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg transform group-hover:scale-105 transition-all">
            Tap to Play
          </span>
        </div>
      </div>
    </div>
  );
}