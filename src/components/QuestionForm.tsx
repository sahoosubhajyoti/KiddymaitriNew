"use client";
import React, { useState, useEffect } from "react";

// 1. Define the shape of a single Question
interface QuestionData {
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
    [key: string]: string; // Allows dynamic access if needed
  };
  correctAnswer: string;
}

// 2. Define the props for the Component
interface QuestionFormProps {
  data: QuestionData;
  index: number;
  total: number;
  onSave: (data: QuestionData) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  loading: boolean;
}

function QuestionForm({
  data,
  index,
  total,
  onSave,
  onNext,
  onPrev,
  onSubmit,
  loading,
}: QuestionFormProps) { // <--- Apply the interface here

  // Local state to handle editing before saving
  const [localData, setLocalData] = useState<QuestionData>(data);

  // Update local state when the prop 'data' changes (user clicked Next/Prev)
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleChange = (field: keyof QuestionData, value: string) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (key: string, value: string) => {
    setLocalData((prev) => ({
      ...prev,
      options: { ...prev.options, [key]: value },
    }));
  };

  // Helper to save current progress before moving
  const handleNavigation = (action: () => void) => {
    onSave(localData); // Save current changes to parent state
    action(); // Trigger Next/Prev/Submit
  };

  return (
    <div className="bg-gray-50 p-6 rounded border border-gray-200">
      <div className="flex justify-between mb-4">
        <h3 className="font-bold text-lg">
          Question {index + 1} of {total}
        </h3>
      </div>

      {/* Question Text */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Text
        </label>
        <textarea
          rows={3}
          value={localData.questionText}
          onChange={(e) => handleChange("questionText", e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {["A", "B", "C", "D"].map((opt) => (
          <div key={opt}>
            <label className="block text-sm font-medium text-gray-700">
              Option {opt}
            </label>
            <input
              type="text"
              value={localData.options[opt]}
              onChange={(e) => handleOptionChange(opt, e.target.value)}
              className={`w-full p-2 border rounded mt-1 ${
                localData.correctAnswer === opt
                  ? "border-green-500 bg-green-50"
                  : ""
              }`}
            />
          </div>
        ))}
      </div>

      {/* Correct Answer Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correct Answer
        </label>
        <div className="flex gap-4">
          {["A", "B", "C", "D"].map((opt) => (
            <label
              key={opt}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name="correctAnswer"
                value={opt}
                checked={localData.correctAnswer === opt}
                onChange={(e) =>
                  handleChange("correctAnswer", e.target.value)
                }
                className="w-4 h-4 text-blue-600"
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t">
        <button
          onClick={() => handleNavigation(onPrev)}
          disabled={index === 0}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
        >
          Previous
        </button>

        {index === total - 1 ? (
          <button
            onClick={() => handleNavigation(onSubmit)}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "Uploading..." : "Submit All Questions"}
          </button>
        ) : (
          <button
            onClick={() => handleNavigation(onNext)}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default QuestionForm;