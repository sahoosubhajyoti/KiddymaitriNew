"use client";
import { useState } from "react";

interface ExerciseCardProps {
  category: string;
  subExercises: string[];
  onSelect: (category: string, sub: string, isSelected: boolean) => void;
}

export default function ExerciseCard({ category, subExercises, onSelect }: ExerciseCardProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSub = (sub: string) => {
    const isAlreadySelected = selected.includes(sub);
    const updated = isAlreadySelected
      ? selected.filter((s) => s !== sub)
      : [...selected, sub];

    setSelected(updated);
    onSelect(category, sub, !isAlreadySelected);
  };

  return (
    <div className="w-64 h-64 bg-white rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition">
      <h2 className="text-lg font-bold text-center text-gray-800">{category}</h2>
      <div className="flex flex-col items-center gap-2 mt-2 overflow-y-auto">
        {subExercises.map((sub) => (
          <button
            key={sub}
            onClick={() => toggleSub(sub)}
            className={`px-3 py-1 text-sm rounded-md w-full text-center transition ${
              selected.includes(sub)
                ? "bg-blue-600 text-white"
                : "bg-blue-100 hover:bg-blue-200 text-blue-900"
            }`}
          >
            {sub}
          </button>
        ))}
      </div>
    </div>
  );
}
