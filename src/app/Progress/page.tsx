"use client";
import { useEffect, useState } from "react";

export default function ProgressPage() {
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/data/`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const json = await res.json();
        setProgress(json.data || []);
      } catch (err) {
        console.error("Failed to load progress data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const headers = [
    "S.No.",
    "Date",
    "Exercise",
    "Questions",
    "Skipped",
    "Correct_Attempts",
    "Incorrect_Attempts",
    "Total_time",
  ];

  return (
    <div className="p-6 mt-10 sm:p-8 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-600 mb-4">
        Progress
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading progress...</p>
      ) : progress.length === 0 ? (
        <p className="text-gray-500">No progress data found.</p>
      ) : (
        <div className="overflow-auto rounded border border-gray-300 shadow-sm">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                {headers.map((key) => (
                  <th
                    key={key}
                    className="px-4 py-2 border font-medium text-left whitespace-nowrap"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {progress.map((entry, index) => (
                <tr key={index} className="even:bg-gray-50">
                  {headers.map((key) => (
                    <td
                      key={key}
                      className="px-4 py-2 border text-center whitespace-nowrap"
                    >
                      {entry[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
