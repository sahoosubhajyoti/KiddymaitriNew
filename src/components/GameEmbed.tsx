"use client";

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useAuth } from "../context/Authcontext"; 
import api from "../utility/axiosInstance"; 
import Link from "next/link"; 
import { IoArrowBack, IoTrophy, IoTime } from "react-icons/io5"; 

interface GameSessionData {
  startTime: number;
  endTime: number;
  duration: number;
  totalCorrect: number;
  totalWrong: number;
  totalMissed: number;
  ballHistory: any[];
}

export default function GameEmbed() {
  const locale = useLocale();
  const { user } = useAuth(); 

  // Stats State (Used for BOTH Guest and User)
  const [highScore, setHighScore] = useState(0);
  const [lastScore, setLastScore] = useState(0);

  // 1. Fetch High Score on Load (If User is Logged In)
  useEffect(() => {
    if (user) {
      const fetchHighScore = async () => {
        try {
          // Adjust this endpoint to match your actual backend route
          const res = await api.get('/analytics/game/highscore'); 
          // Assuming response is { high_score: 200 }
          setHighScore(res.data.high_score || 0);
        } catch (err) {
          console.error("Could not fetch high score", err);
        }
      };
      fetchHighScore();
    }
  }, [user]);

  // 2. Handle Game Events
  useEffect(() => {
    const handleGameMessage = async (event: MessageEvent) => {
      if (event.data && event.data.type === 'GAME_OVER') {
        const gameData = event.data.data as GameSessionData;
        const currentScore = gameData.totalCorrect * 10; 

        // Update Last Score immediately for UI
        setLastScore(currentScore);

        if (user) {
          // --- LOGGED IN LOGIC ---
          
          // 1. Update High Score locally if beaten (Instant UI feedback)
          setHighScore(prev => currentScore > prev ? currentScore : prev);

          // 2. Send Data to Backend
          try {
            await api.post('/analytics/game', {
               score: currentScore,
               correct_moves: gameData.totalCorrect,
               wrong_moves: gameData.totalWrong,
               missed_moves: gameData.totalMissed,
               duration_seconds: gameData.duration,
               played_at: new Date(gameData.startTime).toISOString(),
               ball_history: gameData.ballHistory 
            });
          } catch (error) {
            console.error("❌ Failed to save to backend:", error);
          }

        } else {
          // --- GUEST LOGIC ---
          setHighScore(prev => currentScore > prev ? currentScore : prev);
        }
      }
    };

    window.addEventListener('message', handleGameMessage);
    return () => window.removeEventListener('message', handleGameMessage);
  }, [user]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      
      {/* 📱 HEADER BAR (Visible for EVERYONE now) */}
      <div className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        
        {/* Left: Back Button */}
        <Link 
          href="/Dashboard" 
          className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white rounded-full hover:bg-white/20 transition backdrop-blur-md border border-white/10 text-xs font-medium"
        >
          <IoArrowBack size={16} />
          <span>Exit</span>
        </Link>

        {/* Right: Stats Display */}
        <div className="flex items-center gap-3">
           <div className="flex flex-col items-end">
              {/* Dynamic Label: "GUEST" or User's Name */}
              <span className="text-[10px] text-gray-500 font-['Orbitron'] uppercase tracking-widest mb-0.5">
                {user ? user.name || "PLAYER STATS" : "GUEST SESSION"}
              </span>

              <div className="flex items-center gap-1 text-[#00f3ff] text-xs font-bold font-['Orbitron']">
                  <IoTrophy size={12} />
                  <span>HI: {highScore}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-[10px] font-['Orbitron']">
                  <IoTime size={10} />
                  <span>LAST: {lastScore}</span>
              </div>
           </div>
        </div>

      </div>

      {/* GAME IFRAME */}
      <iframe 
        src={`/neon-math.html?lang=${locale}`} 
        className="w-full h-full border-0"
        title="Neon Math Game"
        scrolling="no"
      />
    </div>
  );
}