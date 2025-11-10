"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/Authcontext";
import ExerciseCard from "../../../components/ExerciseCard";

// 1. IMPORTS for i18n
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "../../../components/LanguageSwitcher"; // <-- CHANGED: Import switcher

// 2. NEW INTERFACES for the new API response
interface SubExercise {
  key: string;
  displayName: string;
}

interface Category {
  key: string;
  displayName: string;
  subExercises: SubExercise[];
}

// (The old ApiData interface is no longer needed for the user part)

export default function Dashboard() {
  // 3. INIT i18n HOOKS
  const t = useTranslations("Dashboard"); // <-- CHANGED: Init useTranslations
  const locale = useLocale(); // <-- CHANGED: Init useLocale

  const { user, loading } = useAuth();
  const router = useRouter();

  // 4. STATE for new API structure
  const [categories, setCategories] = useState<Category[]>([]); // <-- CHANGED: From apiData to categories
  const [selections, setSelections] = useState<
    { category: string; sub: string }[]
  >([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [open, setOpen] = useState(false);

  // 5. UPDATED useEffect
  useEffect(() => {
    if (user?.type === "admin") {
      // (Admin fetch logic remains unchanged)
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
            credentials: "include", // <-- CHANGED: Send current language
          }
        );
        const data = await res.json();
        setCategories(data.categories || []); // <-- CHANGED: Set categories array
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, [user?.type, locale]); // <-- CHANGED: Add locale to dependency array

  const handleSelection = (
    category: string,
    sub: string,
    isSelected: boolean
  ) => {
    // This logic is perfect, it already uses the "key" (which you call 'category' and 'sub')
    setSelections((prev) => {
      if (isSelected) {
        if (prev.length > 0) {
          const activeCategory = prev[0].category;
          if (category !== activeCategory) {
            return [{ category, sub }];
          }
        }
        return [...prev, { category, sub }];
      } else {
        return prev.filter(
          (item) => !(item.category === category && item.sub === sub)
        );
      }
    });
  };

  const handleStart = () => {
    // This logic is also perfect, it sends the keys in the URL
    router.push(
      `/startexercise?data=${encodeURIComponent(JSON.stringify(selections))}`
    );
  };

  if (loading) {
    return <div>{t("loading")}</div>; // <-- CHANGED: Translated static text
  }

  // ✅ Admin Dashboard (Unchanged, as requested)
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
        {/* ... all other admin JSX ... */}
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
  const activeCategory = selections.length > 0 ? selections[0].category : null;
  return (
    <div className="min-h-screen mt-10 flex flex-col items-center bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        {/* // <-- CHANGED: Wrapped in flex to add switcher */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-6">
            {t("welcome")} {/* <-- CHANGED: Translated static text */}
          </h1>
          <LanguageSwitcher /> {/* <-- CHANGED: Added language button */}
        </div>
      </div>

      {/* // <-- CHANGED: Check new 'categories' state */}
      {categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {/* // <-- CHANGED: Map over 'categories' array */}
          {categories.map((category) => {
            const selectedSubsForThisCard = selections
              .filter((item) => item.category === category.key) // <-- CHANGED: Use .key
              .map((item) => item.sub);

            const isCardDisabled =
              activeCategory !== null && category.key !== activeCategory; // <-- CHANGED: Use .key

            return (
              <div
                key={category.key} // <-- CHANGED: Use .key
                className="flex flex-col items-center"
              >
                <ExerciseCard
                  // 7. UPDATED PROPS for ExerciseCard
                  categoryKey={category.key}
                  categoryName={category.displayName}
                  subExercises={category.subExercises}
                  onSelect={handleSelection}
                  selectedSubExercises={selectedSubsForThisCard}
                  isDisabled={isCardDisabled}
                />

                {/* // <-- CHANGED: Use .key for comparison */}
                {activeCategory === category.key && (
                  <button
                    onClick={handleStart}
                    className="mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700"
                  >
                    {t("start")} {/* <-- CHANGED: Translated static text */}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}