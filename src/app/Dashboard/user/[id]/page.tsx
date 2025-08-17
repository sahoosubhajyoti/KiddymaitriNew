"use client";

import React, { useEffect, useState } from "react";

interface UserInfo {
  email?: string;
  join_date?: string;
}

interface DailyActivity {
  date: string;
  session_count: number;
  questions_attempted: number;
}

interface UserData {
  user_info?: UserInfo;
  daily_activity?: DailyActivity[];
}

export default function SingleUser({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [data, setData] = useState<UserData | null>(null);

  // unwrap params
  const { id } = React.use(params);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/metadata/users/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((r) => r.json())
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      });
  }, [id]);

  return (
    <div className="min-h-[60vh] mt-14 bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">User Activity</h1>

      {data ? (
        <div className="bg-white p-4 rounded-lg shadow">
          <p>
            <strong>Email:</strong> {data.user_info?.email || "N/A"}
          </p>
          <p>
            <strong>Joined:</strong> {data.user_info?.join_date || "N/A"}
          </p>

          <h3 className="font-semibold mt-4">Daily Activity</h3>
          <ul className="mt-2 space-y-1">
            {data.daily_activity && data.daily_activity.length > 0 ? (
              data.daily_activity.map((a, i) => (
                <li
                  key={i}
                  className="p-2 border rounded-md bg-gray-50 flex justify-between"
                >
                  <span>{a.date}</span>
                  <span>Sessions: {a.session_count}</span>
                  <span>Questions: {a.questions_attempted}</span>
                </li>
              ))
            ) : (
              <li>No activity found</li>
            )}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
