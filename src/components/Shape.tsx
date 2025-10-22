"use client";

import React from 'react';

// Define the props for the component
interface ShapeProps {
  // The 'shape' prop will be a string like "circle" or "rectangle"
  shape: string | null; 
}

export default function ShapeComponent({ shape }: ShapeProps) {

  /**
   * This "object map" is the cleanest way to handle this.
   * It maps the 'shape' prop string directly to the JSX
   * we want to render. It's a great alternative to a switch-case.
   */
  const shapeMap: { [key: string]: React.ReactNode } = {
    circle: (
      <div className="w-32 h-32 bg-blue-500 rounded-full shadow-md"></div>
    ),
    rectangle: (
      <div className="w-40 h-24 bg-green-500 shadow-md"></div>
    ),
    square: (
      // You can easily add more shapes
      <div className="w-32 h-32 bg-red-500 shadow-md"></div>
    ),
    // A triangle is a bit trickier, but still just CSS!
    triangle: (
       <div className="w-0 h-0
         border-l-[60px] border-l-transparent
         border-b-[100px] border-b-yellow-500
         border-r-[60px] border-r-transparent"
       ></div>
    )
  };

  // 1. Get the shape name, make it lowercase to be safe (e.g., "Circle" -> "circle")
  // 2. Look it up in the shapeMap.
  // 3. If it's not found (or if 'shape' is null), render a fallback.
  const renderedShape =
    shapeMap[shape.toLowerCase()] || (
      <div className="text-gray-500">Shape not specified</div>
    );

  // We use the same wrapper div from your exercise page for consistency
  return (
    <div className="my-6 flex justify-center items-center">
      {renderedShape}
    </div>
  );
}