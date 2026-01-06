"use client";

import React from 'react';
import { useLocale } from 'next-intl'; // Import this

export default function GameEmbed() {
  const locale = useLocale(); // Get current language (en, hin, odi)

  return (
    <div className="w-full h-screen flex justify-center items-center bg-black">
      {/* Pass the lang parameter in the URL */}
      <iframe 
        src={`/neon-math.html?lang=${locale}`} 
        className="w-full h-full border-0"
        title="Neon Math Game"
        scrolling="no"
      />
    </div>
  );
}