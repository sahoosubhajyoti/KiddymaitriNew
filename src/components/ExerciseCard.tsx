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
      className="group relative flex flex-col justify-between w-full aspect-[4/5] min-h-[280px] bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden border-4 border-transparent hover:border-blue-300"
    >
      {/* Colorful Background Gradient (Top decorative part) */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-200 via-blue-100 to-white z-0"></div>

      {/* Image Section - Takes up available space */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 mt-4">
        <div className="relative w-32 h-32 md:w-40 md:h-40 transition-transform duration-500 group-hover:scale-110">
          <img
            src={imageSrc}
            alt={category}
            className="w-full h-full object-contain drop-shadow-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      </div>

      {/* Title Footer - Pushed to bottom */}
      <div className="relative z-10 bg-white p-4 text-center">
        <h2 className="text-xl font-black text-gray-800 uppercase tracking-wide group-hover:text-blue-600 transition-colors">
          {category}
        </h2>
        <div className="mt-1">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors">
            Tap to Play
          </span>
        </div>
      </div>
    </div>
  );
}