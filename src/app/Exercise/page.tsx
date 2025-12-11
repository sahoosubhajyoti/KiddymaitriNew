"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/Authcontext"; // ⚠️ Check this path
import ExerciseCard from "../../components/ExerciseCard"; // ⚠️ Check this path
import api from "../../utility/axiosInstance"; // ⚠️ Check this path

interface ApiData {
  exercises: {
    [key: string]: string[];
  };
}

export default function ExercisePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [apiData, setApiData] = useState<ApiData | null>(null);
  
  // Stores the selected sub-exercises
  const [selections, setSelections] = useState<{ category: string; sub: string }[]>([]);

  // Fetch data on mount
  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        // We reuse the existing endpoint that returns the exercises list
        const res = await api.get('/dashboard/');
        setApiData(res.data);
      } catch (err) {
        console.error("Error fetching exercise data:", err);
      }
    };

    if (user) {
      fetchExerciseData();
    }
  }, [user]);

  // Handle checking/unchecking boxes
  const handleSelection = (
    category: string,
    sub: string,
    isSelected: boolean
  ) => {
    setSelections((prev) => {
      // Logic for ADDING a selection
      if (isSelected) {
        // Check if there are already selections
        if (prev.length > 0) {
          // Get the category that is already active
          const activeCategory = prev[0].category;

          // If the new selection is from a DIFFERENT category...
          if (category !== activeCategory) {
            // ...clear the old selections and start a new list with this item.
            return [{ category, sub }];
          }
        }

        // If we're here, it means either:
        // 1. The array was empty.
        // 2. The new item is in the SAME category.
        return [...prev, { category, sub }];

      } else {
        // Logic for REMOVING a selection
        return prev.filter(
          (item) => !(item.category === category && item.sub === sub)
        );
      }
    });
  };

  const handleStart = () => {
    // Navigate to start page with selections as query param
    router.push(
      `/startexercise?data=${encodeURIComponent(JSON.stringify(selections))}`
    );
  };

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // Helper to determine which category is currently active (if any)
  const activeCategory = selections.length > 0 ? selections[0].category : null;

  return (
    <div className="min-h-screen mt-10 flex flex-col items-center bg-gray-50 p-6">
      
      {/* Header with Back Button */}
      <div className="w-full max-w-4xl mb-6 flex items-center justify-between">
        <Link href="/Dashboard" className="text-gray-500 hover:text-gray-800 flex items-center gap-2">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl text-center">
        <h1 className="text-2xl font-bold mb-2">Select Your Exercises 📚</h1>
        <p className="text-gray-600">Choose a category and select topics to practice.</p>
      </div>

      {apiData?.exercises ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8 w-full max-w-5xl">
          {Object.entries(apiData.exercises).map(([category, subExercises]) => {
            
            // Filter the parent's 'selections' to get the list for *this* card
            const selectedSubsForThisCard = selections
              .filter((item) => item.category === category)
              .map((item) => item.sub);

            // Optional: Visually disable card if another category is active
            const isDimmed = activeCategory && activeCategory !== category;

            return (
              <div
                key={category}
                className={`flex flex-col items-center transition-opacity duration-300 ${
                  isDimmed ? "opacity-50 pointer-events-none" : "opacity-100"
                }`}
              >
                <ExerciseCard
                  category={category}
                  subExercises={subExercises}
                  onSelect={handleSelection}
                  selectedSubExercises={selectedSubsForThisCard}
                />

                {/* Only show Start button under the Active Category */}
                {activeCategory === category && (
                  <button
                    onClick={handleStart}
                    className="mt-4 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors animate-fade-in-up"
                  >
                    Start Practice &rarr;
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-10 text-gray-500">
           {/* Fallback if no data or still loading data */}
           Loading exercises...
        </div>
      )}
    </div>
  );
}