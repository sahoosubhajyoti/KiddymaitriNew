"use client";

import React from 'react';

// --- Helper Components ---

// Renders a single vertical stick: |
const SingleStick = () => (
  <div className="w-1 h-8 bg-gray-700 rounded-full"></div>
);

// Renders a group of 5 sticks: <s>||||</s>
const FiveGroup = () => (
  <div className="relative inline-flex gap-1.5 p-1 mr-3">
    {/* The 4 vertical sticks */}
    <SingleStick />
    <SingleStick />
    <SingleStick />
    <SingleStick />
    
    {/* The diagonal strike-through line.
      - We use 'absolute' to overlay it.
      - 'scale-x-125' makes it slightly wider than the 4 sticks.
      - '-rotate-45' tilts it.
    */}
    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 -rotate-45 origin-center scale-x-125"></div>
  </div>
);


// --- Main Component ---

interface StickProps {
  // Receives the number as a string (from qnsData)
  count: string | null;
}

export default function StickComponent({ count }: StickProps) {
  
  // 1. Safely parse the count string into a number
  //    'parseInt' handles the string ("5" -> 5)
  //    '|| 0' provides a fallback if 'count' is null or invalid
  const stickCount = parseInt(count || '0', 10);

  // 2. This function builds the array of JSX sticks
  const renderTally = () => {
    const elements = [];
    let currentCount = stickCount;

    // Add groups of 5
    while (currentCount >= 5) {
      elements.push(<FiveGroup key={`five-${elements.length}`} />);
      currentCount -= 5;
    }

    // Add the remaining sticks (1, 2, 3, or 4)
    const remainder = [];
    for (let i = 0; i < currentCount; i++) {
      remainder.push(<SingleStick key={`single-${i}`} />);
    }

    // Add the remainder group to the main elements array
    if (remainder.length > 0) {
      elements.push(
        <div key="remainder" className="inline-flex gap-1.5 p-1">
          {remainder}
        </div>
      );
    }
    
    // Handle the edge case of "0"
    if (stickCount === 0) {
      return <div className="text-gray-500">0</div>;
    }

    return elements;
  };

  // 3. Render the sticks inside the consistent wrapper
  return (
    <div className="my-6 flex justify-center items-center h-12">
      {renderTally()}
    </div>
  );
}