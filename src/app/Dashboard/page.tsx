"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/Authcontext";
import ExerciseCard from "../../components/ExerciseCard";

interface ApiData {
  exercises: {
    [key: string]: string[]; // An object with string keys and string array values
  };
  // You can add other properties from your API response here
}

export default function Dashboard() {
  const { user,loading } = useAuth();
  const router = useRouter();
   const [apiData, setApiData] = useState<ApiData | null>(null);
  const [selections, setSelections] = useState<
    { category: string; sub: string }[]
  >([]);

  useEffect(() => {
    if (user?.type === "admin"){
      return;
    }
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
  }, []);

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
  console.log("Selected:", selections);

  // Correct way to navigate with query params in the App Router
  router.push(
    `/startexercise?data=${encodeURIComponent(JSON.stringify(selections))}`
  );
};
 if (loading) {
  // You can return a loading spinner or message here
  return <div>Loading...</div>;
 }

 if (user?.type === "admin") {
  return (
   <div className="min-h-screen mt-10 flex flex-col items-center p-6 bg-gray-50">
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
     <h1 className="text-2xl font-bold mb-6">Welcome, Admin 👋</h1>
    </div>
   </div>
  );
 }
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
