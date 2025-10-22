"use client"; // Required because we use the useRouter hook

import React from 'react';

export default function Clock({ time }: { time: string }) {
  // Parse the time string "HH:MM"
  console.log(time);
  const [hours, minutes] = time.split(":").map(Number);

  // Calculate degrees for hands
  // Hour hand: 30 deg per hour + 0.5 deg per minute
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  // Minute hand: 6 deg per minute
  const minuteDeg = minutes * 6;

  return (
    <div className="w-40 h-40 bg-gray-100 border-4 border-gray-700 rounded-full relative shadow-inner">
      {/* Clock Face Numbers */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-lg">||</div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-lg">|</div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 font-bold text-lg">.</div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 font-bold text-lg">.</div>
      
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-gray-800 rounded-full -translate-x-1/2 -translate-y-1/2 z-20"></div>
      
      {/* Hour Hand */}
      <div
        className="absolute top-1/2 left-1/2 w-1.5 h-1/4 bg-gray-800 origin-bottom rounded-t-full -translate-x-1/2 -translate-y-full z-10"
        style={{ transform: `rotate(${hourDeg}deg)` }}
      ></div>
      
      {/* Minute Hand */}
      <div
        className="absolute top-1/2 left-1/2 w-1 h-1/3 bg-gray-800 origin-bottom rounded-t-full -translate-x-1/2 -translate-y-full z-10"
        style={{ transform: `rotate(${minuteDeg}deg)` }}
      ></div>
    </div>
  );
}