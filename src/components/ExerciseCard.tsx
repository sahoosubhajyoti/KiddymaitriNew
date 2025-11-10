"use client";

// 1. DEFINE THE NEW PROPS
interface SubExercise {
  key: string;
  displayName: string;
}

interface ExerciseCardProps {
  categoryKey: string;
  categoryName: string;
  subExercises: SubExercise[];
  selectedSubExercises: string[];
  onSelect: (categoryKey: string, subExerciseKey: string, isSelected: boolean) => void;
  isDisabled: boolean;
}

export default function ExerciseCard({
  categoryKey,
  categoryName,
  subExercises,
  selectedSubExercises,
  onSelect,
  isDisabled,
}: ExerciseCardProps) {
  
  // Handle click on a sub-exercise
  const handleSubExerciseClick = (subExerciseKey: string) => {
    // Don't do anything if the card is disabled
    if (isDisabled) return;
    
    const isCurrentlySelected = selectedSubExercises.includes(subExerciseKey);
    // Call the onSelect function passed from the Dashboard
    onSelect(categoryKey, subExerciseKey, !isCurrentlySelected);
  };

  return (
    <div
      className={`
        bg-white rounded-lg shadow-md p-6 w-full max-w-sm
        transition-all duration-300
        ${isDisabled ? 'opacity-50 saturate-50 cursor-not-allowed' : 'hover:shadow-lg'}
      `}
    >
      {/* 2. USE categoryName for the title */}
      <h2 className="text-xl font-bold mb-4 text-center capitalize">
        {categoryName}
      </h2>

      <div className="space-y-3">
        {/* 3. MAP over the new subExercises array (of objects) */}
        {subExercises.map((sub) => {
          // Check if this sub-exercise is in the selected list
          const isSelected = selectedSubExercises.includes(sub.key);

          return (
            <button
              key={sub.key}
              onClick={() => handleSubExerciseClick(sub.key)}
              disabled={isDisabled}
              className={`
                w-full p-3 rounded-md text-left font-semibold
                border border-transparent
                transition-all duration-200
                ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                ${
                  isSelected
                    ? 'bg-green-600 text-white shadow-inner'
                    : `bg-gray-100 text-gray-800 ${!isDisabled ? 'hover:bg-gray-200 hover:border-gray-300' : ''}`
                }
              `}
            >
              {/* 4. USE sub.displayName for the text */}
              {sub.displayName}
            </button>
          );
        })}
      </div>
    </div>
  );
}

