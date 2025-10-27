"use client";
import React from "react";

export default function Fraction({ frac }: { frac: string }) {
  const [numerator, denomenator] = frac.split("/").map(Number);

  // --- Handle invalid/edge cases ---
  if (isNaN(numerator) || isNaN(denomenator) || denomenator === 0) {
    return (
      <svg width="128" height="128" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="49" fill="#E2E8F0" stroke="black" strokeWidth="2" />
        <text x="50" y="50" textAnchor="middle" dy=".3em" fill="red" fontSize="24">?</text>
      </svg>
    );
  }

  // Draw a single circle if 0/X or X/X
  if (numerator === 0) {
    return (
      <svg width="128" height="128" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="49" fill="#E2E8F0" stroke="black" strokeWidth="2" />
      </svg>
    );
  }
  if (numerator === denomenator) {
    return (
      <svg width="128" height="128" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="49" fill="#3B82F6" stroke="black" strokeWidth="2" />
      </svg>
    );
  }
  // --- End of edge cases ---

  // Create an array [0, 1, 2, ..., denomenator - 1]
  const slices = Array.from({ length: denomenator }, (_, i) => i);
  
  // Get the angle for a single slice (e.g., 1/4 = 90 deg)
  const sliceAngle = (2 * Math.PI) / denomenator;

  // The large arc flag is 0 unless a single slice is > 180deg (e.g., 1/1)
  const largeArcFlag = denomenator <= 2 ? 1 : 0;

  return (
    <svg width="128" height="128" viewBox="0 0 100 100">
      {slices.map((i) => {
        // Calculate start and end angles for this slice
        const startAngle = i * sliceAngle;
        const endAngle = (i + 1) * sliceAngle;

        // Get (x, y) for start of arc
        const startX = 50 + 50 * Math.sin(startAngle);
        const startY = 50 - 50 * Math.cos(startAngle);

        // Get (x, y) for end of arc
        const endX = 50 + 50 * Math.sin(endAngle);
        const endY = 50 - 50 * Math.cos(endAngle);

        // Build the path string
        const pathD = [
          `M 50 50`, // Move to center
          `L ${startX} ${startY}`, // Line to arc start
          `A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc to end
          `Z` // Close path
        ].join(" ");

        // Determine fill color (blue if i < 2, gray if i >= 2)
        const fill = i < numerator ? "#3B82F6" : "#E2E8F0";

        return (
          <path
            key={i}
            d={pathD}
            fill={fill}
            // This stroke creates the "margin" effect.
            // Use "white" or your page's background color.
            stroke="black"
            strokeWidth="1"
          />
        );
      })}

      {/* Add the outer black border *on top* of everything else.
        This covers the white stroke on the outer edge
        and gives a clean black border.
      */}
      <circle
        cx="50"
        cy="50"
        r="49"
        fill="none"
        stroke="black"
        strokeWidth="2"
      />
    </svg>
  );
}