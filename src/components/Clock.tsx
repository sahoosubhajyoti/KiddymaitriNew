"use client"; // Required because we use the useRouter hook

import React from 'react';

export default function Clock({ time }: { time: string }) {
// Parse the time string "HH:MM"
 const [hours, minutes] = time.split(":").map(Number);

// Calculate degrees for hands
// Hour hand: 30 deg per hour + 0.5 deg per minute
 const hourDeg = (hours % 12) * 30 + minutes * 0.5;
// Minute hand: 6 deg per minute
 const minuteDeg = minutes * 6;

 // A common style for all the numbers
 const numStyle = "absolute font-bold text-lg text-gray-700";

 return (
 <div className="w-40 h-40 bg-gray-100 border-4 border-gray-700 rounded-full relative shadow-inner flex items-center justify-center">
 {/* Clock Face Numbers */}
 <div className="absolute inset-0">
  {[...Array(12)].map((_, i) => (
   <div
   key={i}
   className="absolute w-full h-full top-0 left-0 flex justify-center items-start pt-1"
   style={{ transform: `rotate(${i * 30}deg)` }}
   >
   <div
    style={{ transform: `rotate(-${i * 30}deg)` }}
    className={`${numStyle} text-xl`}
   >
    {i === 0 ? '||' : i === 6 ? '|' : '.'}
   </div>
   </div>
  ))}
 </div>
 
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