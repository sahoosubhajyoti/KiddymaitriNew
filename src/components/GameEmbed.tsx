"use client";

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useAuth } from "../context/Authcontext"; // Import Auth
import api from "../utility/axiosInstance"; 

// Define the data shape
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
  const { user } = useAuth(); // Get current user status

  // 🟢 Guest State (Resets on Refresh)
  const [guestHighScore, setGuestHighScore] = useState(0);
  const [guestLastScore, setGuestLastScore] = useState(0);

  useEffect(() => {
    const handleGameMessage = async (event: MessageEvent) => {
      // Security check
      if (event.data && event.data.type === 'GAME_OVER') {
        const gameData = event.data.data as GameSessionData;
        const currentScore = gameData.totalCorrect * 10; // Calculate Score (10 pts per correct)

        console.log("📊 Game Over. Score:", currentScore);

        // ====================================================
        // 🔒 SCENARIO 1: LOGGED IN USER -> Send to Backend
        // ====================================================
        if (user) {
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
            console.log("✅ Data sent to Backend");
          } catch (error) {
            console.error("❌ Failed to save to backend:", error);
          }
        } 
        
        // ====================================================
        // 👤 SCENARIO 2: GUEST USER -> Save to Browser State
        // ====================================================
        else {
          console.log("👤 Guest Mode: Saving locally");
          setGuestLastScore(currentScore);
          
          // Update High Score if beaten
          setGuestHighScore(prevHigh => {
            return currentScore > prevHigh ? currentScore : prevHigh;
          });
        }
      }
    };

    window.addEventListener('message', handleGameMessage);
    return () => window.removeEventListener('message', handleGameMessage);
  }, [user]); // Re-bind listener if user login state changes

  return (
    <div className="relative w-full h-screen flex justify-center items-center bg-black">
      
      {/* 🟢 GUEST SCOREBOARD (Only visible if NOT logged in) */}
      {!user && (
        <div className="absolute top-4 right-4 z-40 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-right">
          <p className="text-gray-400 text-xs font-['Orbitron'] uppercase tracking-widest">Guest Session</p>
          <div className="mt-1">
            <span className="text-white font-['Orbitron'] text-sm">High Score: </span>
            <span className="text-[#00f3ff] font-bold font-['Orbitron'] text-xl">{guestHighScore}</span>
          </div>
          <div className="mt-1">
             <span className="text-gray-300 font-['Orbitron'] text-xs">Last Run: </span>
             <span className="text-white font-bold font-['Orbitron']">{guestLastScore}</span>
          </div>
        </div>
      )}

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