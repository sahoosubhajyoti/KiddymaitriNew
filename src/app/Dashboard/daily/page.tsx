"use client";
import { useEffect, useState } from "react";
interface DailyActivityData {
  date: string;
  sessions: number;
  users: number;
}

export default function DailyActivity() {
  // 1. Define an interface for the shape of your data

  const [daily, setDaily] = useState<DailyActivityData[]>([]);

  useEffect(() => {
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/exercise-analysis/metadata/daily/`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      )
        .then((r) => r.json())
        .then(setDaily);
  }, []);

  return (
    <div className="min-h-[60vh] mt-14 bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Daily Activity</h1>
      <ul className="bg-white rounded-lg shadow p-4 space-y-2">
        {daily.map((d, i) => (
          <li key={i} className="border-b pb-2">
            {d.date} → {d.sessions} sessions, {d.users} users
          </li>
        ))}
      </ul>
    </div>
  );
}
