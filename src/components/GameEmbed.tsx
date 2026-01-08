"use client";

import React, { useEffect } from 'react';
import { useLocale } from 'next-intl';
import api from "../utility/axiosInstance"; 

// Define the shape of data coming from the Game (HTML file)
interface GameSessionData {
  startTime: number;
  endTime: number;
  duration: number;
  totalCorrect: number;
  totalWrong: number;
  totalMissed: number; // New!
  ballHistory: Array<{ // New detailed history!
    number: number;
    spawnTime: string;
    endTime: string;
    reactionTimeMs: number;
    result: "CORRECT" | "WRONG" | "MISSED";
    basketChosen: "EVEN" | "ODD" | null;
  }>;
}

export default function GameEmbed() {
  const locale = useLocale();

  useEffect(() => {
    const handleGameMessage = async (event: MessageEvent) => {
      // Security check
      if (event.data && event.data.type === 'GAME_OVER') {
        const gameData = event.data.data as GameSessionData;

        console.log("📊 Received Detailed Game Data:", gameData);

        try {
          // Send to your Backend
          const response = await api.post('/analytics/game', {
             // Basic Stats
             score: gameData.totalCorrect * 10, 
             correct_moves: gameData.totalCorrect,
             wrong_moves: gameData.totalWrong,
             missed_moves: gameData.totalMissed, // New Field
             duration_seconds: gameData.duration,
             played_at: new Date(gameData.startTime).toISOString(),
             session_id: 1,
             
             // 🔥 The Detailed Log (JSON Array) 🔥
             ball_history: gameData.ballHistory 
          });
          
          console.log("✅ Game data saved to backend:", response.data);
          
        } catch (error) {
          console.error("❌ Failed to save game data:", error);
        }
      }
    };

    window.addEventListener('message', handleGameMessage);
    return () => window.removeEventListener('message', handleGameMessage);
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-black">
      <iframe 
        src={`/neon-math.html?lang=${locale}`} 
        className="w-full h-full border-0"
        title="Neon Math Game"
        scrolling="no"
      />
    </div>
  );
}