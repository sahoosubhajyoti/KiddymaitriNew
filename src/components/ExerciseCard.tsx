"use client";
// We no longer need useState here
// import { useState } from "react"; 

interface ExerciseCardProps {
  category: string;
  subExercises: string[];
  onSelect: (category: string, sub: string, isSelected: boolean) => void;
  // NEW: Prop to receive the list of selected subs for this card
  selectedSubExercises: string[];
  // NEW: Prop to disable the card if another category is active
  disabled: boolean;
}

export default function ExerciseCard({
  category,
  subExercises,
  onSelect,
  selectedSubExercises, // Use the new prop
  disabled,             // Use the new prop
}: ExerciseCardProps) {
  
  // REMOVED: The internal 'selected' state is gone
  // const [selected, setSelected] = useState<string[]>([]);

  const toggleSub = (sub: string) => {
    // If the card is disabled, do nothing
    if (disabled) return;

    // Check if the sub is already selected *based on the prop*
    const isAlreadySelected = selectedSubExercises.includes(sub);
    
    // We no longer call setSelected()
    // Just tell the parent what happened
    onSelect(category, sub, !isAlreadySelected);
  };

  return (
    <div
      className={`w-64 h-64 bg-white rounded-xl shadow-md p-4 flex flex-col justify-between transition ${
        // NEW: Apply styles when disabled
        disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "hover:shadow-lg"
      }`}
    >
      <h2 className="text-lg font-bold text-center text-gray-800">{category}</h2>
      
      <div className="flex flex-col items-center gap-2 mt-2 overflow-y-auto">
        {subExercises.map((sub) => (
          <button
            key={sub}
            onClick={() => toggleSub(sub)}
            // NEW: Disable the button itself
            disabled={disabled}
            className={`px-3 py-1 text-sm rounded-md w-full text-center transition ${
              // NEW: Check selection status from the prop
              selectedSubExercises.includes(sub)
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-900"
            } ${
              // NEW: More disabled styles for the button
              disabled
                ? "cursor-not-allowed"
                : "hover:bg-blue-200"
            }`}
          >
            {sub}
          </button>
        ))}
      </div>
    </div>
  );
}