"use client";
import { useEffect, useState } from "react";
interface QuestionData {
  name: string;
  attempts: number;
  correct_rate: number;
  avg_time: number;
}

export default function QuestionPerformance() {
  // Defines the shape of the question performance data

   const [questions, setQuestions] = useState<QuestionData[]>([]);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/metadata/questions`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    )
      .then((r) => r.json())
      .then((d) => setQuestions(d.top_questions));
  }, []);

  return (
    <div className="min-h-[60vh] mt-14 bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Top Questions</h1>
      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Name</th>
            <th>Attempts</th>
            <th>Correct Rate</th>
            <th>Avg Time</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{q.name}</td>
              <td>{q.attempts}</td>
              <td>{(q.correct_rate * 100).toFixed(1)}%</td>
              <td>{Math.round(q.avg_time)} sec</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
