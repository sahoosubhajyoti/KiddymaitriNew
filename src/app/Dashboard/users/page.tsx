"use client";
import { useEffect, useState } from "react";
// Defines the shape of the main data object
interface QuestionStats {
  correct_rate: number;
}
interface UserData {
  total_users: number;
  active_users: number;
  question_stats: QuestionStats;
}
export default function UserActivityMetadata() {
  const [data, setData] = useState<UserData | null>(null);


  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/metadata/users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((r) => r.json())
      .then(setData);
  }, []);

  return (
    <div className="min-h-[60vh] mt-14 bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">User Activity Metadata</h1>
      {data && (
        <div className="bg-white shadow rounded-lg p-4">
          <p>Total Users: {data.total_users}</p>
          <p>Active Users: {data.active_users}</p>
          <p>
            Correct Rate: {(data.question_stats.correct_rate * 100).toFixed(1)}%
          </p>
        </div>
      )}
    </div>
  );
}
