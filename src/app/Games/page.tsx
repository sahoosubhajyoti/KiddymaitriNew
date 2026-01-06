"use client";

import React from "react";
import Link from "next/link";
import GameEmbed from "../../components/GameEmbed"; // Make sure path is correct based on your folder structure
import { IoArrowBack } from "react-icons/io5";

export default function GamesPage() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      
      {/* 1. Back Button Overlay (So users aren't stuck in the game) */}
      <div className="absolute top-4 left-4 z-50">
        <Link 
          href="/#home" 
          className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition backdrop-blur-md border border-white/10"
        >
          <IoArrowBack />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </Link>
      </div>

      {/* 2. The Game Embed (Iframe) */}
      <GameEmbed />
      
    </div>
  );
}