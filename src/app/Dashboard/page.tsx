"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/Authcontext";
import ExerciseCard from "../../components/ExerciseCard";

interface ApiData {
  exercises: {
    [key: string]: string[];
  };
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [selections, setSelections] = useState<
    { category: string; sub: string }[]
  >([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [open, setOpen] = useState(false);

  // Fetch data
  useEffect(() => {
    if (user?.type === "admin") {
      // Fetch summary API for Admin
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/metadata/users`,
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
          setTotalUsers(res.total_users || 0);
        })
        .catch((err) => {
          console.error("Error fetching metadata:", err);
        });
      return;
    }

    // Fetch user dashboard data
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await res.json();
        setApiData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, [user?.type]);

  const handleSelection = (
    category: string,
    sub: string,
    isSelected: boolean
  ) => {
    setSelections((prev) => {
      if (isSelected) {
        return [...prev, { category, sub }];
      } else {
        return prev.filter(
          (item) => !(item.category === category && item.sub === sub)
        );
      }
    });
  };

  const handleStart = () => {
    router.push(
      `/startexercise?data=${encodeURIComponent(JSON.stringify(selections))}`
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // ✅ Admin Dashboard
  if (user?.type === "admin") {
    return (
      <div className="min-h-[60vh] mt-14 bg-gray-100 p-6 space-y-4">
        <div className="rounded-lg p-4 flex justify-around items-center">
          <h1 className="text-4xl font-bold mb-4 underline-offset-8 underline">
            Admin Dashboard
          </h1>
          <Link
            href="/Dashboard/export"
            className="bg-red-600 text-white px-4 py-3 rounded hover:bg-red-700"
          >
            Export Data
          </Link>
        </div>

        {/* User Activity Metadata */}
        <div className="bg-white shadow rounded-lg p-4 flex justify-between">
          <span>User Activity Metadata</span>
          <Link
            href="/Dashboard/users"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Get Report
          </Link>
        </div>

        {/* Question Performance */}
        <div className="bg-white shadow rounded-lg p-4 flex justify-between">
          <span>Question Performance</span>
          <Link
            href="/Dashboard/questions"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Get Report
          </Link>
        </div>

        {/* Time-Based Analytics */}
        <div className="bg-white shadow rounded-lg p-4 flex justify-between">
          <span>Time-Based Analytics</span>
          <Link
            href="/Dashboard/daily"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Get Report
          </Link>
        </div>

        {/* Single User Activity with dropdown */}
        <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
          <span className="font-semibold">Single User Activity</span>
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Get Report
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-10">
                {totalUsers > 0 ? (
                  Array.from({ length: totalUsers }, (_, i) => i + 1).map(
                    (id) => (
                      <Link
                        key={id}
                        href={`/Dashboard/user/${id}`}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        User {id}
                      </Link>
                    )
                  )
                ) : (
                  <p className="px-4 py-2 text-gray-500">No users found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ✅ Normal User Dashboard
  return (
    <div className="min-h-screen mt-10 flex flex-col items-center bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Welcome, 👋</h1>
      </div>

      {apiData?.exercises && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {Object.entries(apiData.exercises).map(([category, subExercises]) => (
            <ExerciseCard
              key={category}
              category={category}
              subExercises={subExercises}
              onSelect={handleSelection}
            />
          ))}
        </div>
      )}

      {selections.length > 0 && (
        <button
          onClick={handleStart}
          className="mt-10 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700"
        >
          Start
        </button>
      )}
    </div>
  );
}
