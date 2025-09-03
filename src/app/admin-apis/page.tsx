"use client";
import { useEffect, useState } from "react";
// --- INTERFACE DEFINITIONS ---
interface UserStats {
  total_users: number;
  active_users: number;
  question_stats: {
    correct_rate: number;
  };
}

interface TopQuestion {
  name: string;
  attempts: number;
  correct_rate: number;
  avg_time: number;
}

interface DailyActivity {
  date: string;
  sessions: number;
  users: number;
}

interface UserDetail {
  user_info: {
    email: string;
    join_date: string;
  };
  daily_activity: {
    date: string;
    session_count: number;
    questions_attempted: number;
  }[];
}
export default function Dashboard() {
// --- BEFORE ---
// const [userStats, setUserStats] = useState<any>(null);
// const [questions, setQuestions] = useState<any[]>([]);
// const [daily, setDaily] = useState<any[]>([]);
// const [userDetail, setUserDetail] = useState<any>(null);

// --- AFTER ---
const [userStats, setUserStats] = useState<UserStats | null>(null);
const [questions, setQuestions] = useState<TopQuestion[]>([]);
const [daily, setDaily] = useState<DailyActivity[]>([]);
const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [userId, setUserId] = useState("");
  const API_BASE = "http://localhost:8000/api/analytics"

  useEffect(() => {
    fetch(`${API_BASE}/metadata/users/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((r) => r.json())
      .then(setUserStats);
    fetch(`${API_BASE}/metadata/questions/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => setQuestions(d.top_questions));
    fetch(`${API_BASE}/metadata/daily/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((r) => r.json())
      .then(setDaily);
  }, []);

  const fetchUser = async () => {
    const res = await fetch(`${API_BASE}/metadata/users/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    setUserDetail(await res.json());
  };

  const exportReport = async () => {
    const res = await fetch(`${API_BASE}/metadata/export`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.json";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      {/* User Stats */}
      <div className="bg-white shadow-md rounded-2xl p-4">
        <h2 className="text-xl font-semibold">User Stats</h2>
        {userStats && (
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div>Total Users: {userStats.total_users}</div>
            <div>Active Users: {userStats.active_users}</div>
            <div>
              Correct Rate:{" "}
              {(userStats.question_stats.correct_rate * 100).toFixed(1)}%
            </div>
          </div>
        )}
      </div>

      {/* Top Questions */}
      <div className="bg-white shadow-md rounded-2xl p-4">
        <h2 className="text-xl font-semibold">Top Questions</h2>
        <table className="w-full mt-2 border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Attempts</th>
              <th className="p-2 text-left">Correct Rate</th>
              <th className="p-2 text-left">Avg Time</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
               <tr key={q.name} className="border-t">
                <td className="p-2">{q.name}</td>
                <td className="p-2">{q.attempts}</td>
                <td className="p-2">{(q.correct_rate * 100).toFixed(1)}%</td>
                <td className="p-2">{Math.round(q.avg_time)} sec</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Daily Activity */}
      <div className="bg-white shadow-md rounded-2xl p-4">
        <h2 className="text-xl font-semibold">Daily Activity</h2>
        <ul className="mt-2 space-y-1">
          {daily.map((d) => (
            <li key={d.date} className="border-b pb-1">
              {d.date} → {d.sessions} sessions, {d.users} users
            </li>
          ))}
        </ul>
      </div>

      {/* Export Report */}
      <button
        onClick={exportReport}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        Export Metadata
      </button>

      {/* Single User */}
      <div className="bg-white shadow-md rounded-2xl p-4">
        <h2 className="text-xl font-semibold">Single User Activity</h2>
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border rounded-lg p-2 w-40"
          />
          <button
            onClick={fetchUser}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Fetch
          </button>
        </div>
        {userDetail && (
          <div className="mt-4">
            <p>Email: {userDetail.user_info?.email}</p>
            <p>Joined: {userDetail.user_info?.join_date}</p>
            <h3 className="font-semibold mt-2">Daily Activity</h3>
            <ul>
              {userDetail.daily_activity?.map((a) => (
                <li key={a.date}>
                  {a.date}: {a.session_count} sessions, {a.questions_attempted}{" "}
                  questions
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
