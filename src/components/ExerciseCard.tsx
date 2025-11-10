"use client";

interface ExerciseCardProps {
  category: string;
  subExercises: string[];
  onSelect: (category: string, sub: string, isSelected: boolean) => void;
  // Prop to receive the list of selected subs for this card
  selectedSubExercises: string[];
  // REMOVED: The 'disabled' prop is gone
}

export default function ExerciseCard({
  category,
  subExercises,
  onSelect,
  selectedSubExercises, // Use the new prop
}: ExerciseCardProps) {
  
  const toggleSub = (sub: string) => {
    // REMOVED: The 'if (disabled) return;' check is gone

    // Check if the sub is already selected *based on the prop*
    const isAlreadySelected = selectedSubExercises.includes(sub);

    // Just tell the parent what happened
    onSelect(category, sub, !isAlreadySelected);
  };

  return (
    <div
      className={`w-64 h-64 bg-white rounded-xl shadow-md p-4 flex flex-col justify-between transition hover:shadow-lg`}
      // REMOVED: All 'disabled' styling is gone from here
    >
      <h2 className="text-lg font-bold text-center text-gray-800">{category}</h2>

      <div className="flex flex-col items-center gap-2 mt-2 overflow-y-auto">
        {subExercises.map((sub) => (
          <button
            key={sub}
            onClick={() => toggleSub(sub)}
            // REMOVED: 'disabled={disabled}' prop is gone
            className={`px-3 py-1 text-sm rounded-md w-full text-center transition ${
              // Check selection status from the prop
              selectedSubExercises.includes(sub)
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-900 hover:bg-blue-200"
            }`}
            // REMOVED: All 'disabled' styling is gone from here
          >
            {sub}
          </button>
        ))}
      </div>
    </div>
  );
}