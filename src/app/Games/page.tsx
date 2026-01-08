"use client";

import React from "react";
import Link from "next/link";
import GameEmbed from "../../components/GameEmbed"; // Make sure path is correct based on your folder structure
import { IoArrowBack } from "react-icons/io5";

export default function GamesPage() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      
      {/* 1. Back Button Overlay (So users aren't stuck in the game) */}
 

      {/* 2. The Game Embed (Iframe) */}
      <GameEmbed />
      
    </div>
  );
}