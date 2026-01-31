"use client";
import { useState, ChangeEvent } from "react";
import * as XLSX from "xlsx";
import api from "../../utility/axiosInstance";
import QuestionForm from "../../components/QuestionForm";

// 1. Define Interfaces (must match what QuestionForm expects)
interface QuestionData {
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
    [key: string]: string;
  };
  correctAnswer: string;
}

interface MetaData {
  className: string;
  subject: string;
  chapter: string;
}

const AddQuestionsPage = () => {
  // --- STATE ---
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Typed Metadata
  const [metaData, setMetaData] = useState<MetaData>({
    className: "",
    subject: "",
    chapter: "",
  });

  // Typed Questions Array (Crucial!)
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);

  // --- HANDLERS ---

  // Typed Event Handler
  const handleMetaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMetaData({ ...metaData, [e.target.name]: e.target.value });
  };

  // Typed File Upload Handler
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Optional chaining for safety
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      if (!bstr) return;

      const workbook = XLSX.read(bstr, { type: "binary" });
      const wsname = workbook.SheetNames[0];
      const ws = workbook.Sheets[wsname];

      // Convert to JSON (Typing raw data as any[] to allow mapping)
      const data: any[] = XLSX.utils.sheet_to_json(ws);

      // Map Excel headers to your state structure
      const formattedQuestions: QuestionData[] = data.map((row) => ({
        questionText: row.question || "",
        options: {
          A: row.optionA || "",
          B: row.optionB || "",
          C: row.optionC || "",
          D: row.optionD || "",
        },
        correctAnswer: row.answer || "A",
      }));

      setQuestions(formattedQuestions);
      setStep(3);
    };
    reader.readAsBinaryString(file);
  };

  // Typed Question Save
  const handleQuestionSave = (updatedQuestionData: QuestionData) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQIndex] = updatedQuestionData;
    setQuestions(updatedQuestions);
  };

  // Navigation inside QuestionForm
  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex((prev) => prev - 1);
    }
  };

  // Final Submission
  const handleFinalSubmit = async () => {
    setLoading(true);
    const payload = {
      ...metaData,
      questions: questions,
    };

    try {
      const response = await api.post("/mcq/admin/bulk-upload", payload);
      alert("Questions uploaded successfully!");
      setStep(1);
      setQuestions([]);
      setMetaData({ className: "", subject: "", chapter: "" }); // Reset metadata too
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload questions.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      
      {/* STEP 1: METADATA FORM */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Step 1: Class Details</h2>
          <div>
            <label className="block text-gray-700">Class Name</label>
            <input
              type="text"
              name="className"
              placeholder="e.g. Class 10"
              value={metaData.className}
              onChange={handleMetaChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="e.g. Mathematics"
              value={metaData.subject}
              onChange={handleMetaChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <div>
            <label className="block text-gray-700">Chapter</label>
            <input
              type="text"
              name="chapter"
              placeholder="e.g. Algebra"
              value={metaData.chapter}
              onChange={handleMetaChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <button
            disabled={!metaData.className || !metaData.subject}
            onClick={() => setStep(2)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            Next: Upload File
          </button>
        </div>
      )}

      {/* STEP 2: EXCEL UPLOAD */}
      {step === 2 && (
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Step 2: Upload Excel</h2>
          <p className="text-gray-500 mb-4">
            Please upload an .xlsx file with columns:
            <br />{" "}
            <code className="bg-gray-100 p-1">
              question, optionA, optionB, optionC, optionD, answer
            </code>
          </p>

          <div className="flex justify-center">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          <button
            onClick={() => setStep(1)}
            className="text-gray-500 underline mt-4"
          >
            Back to Step 1
          </button>
        </div>
      )}

      {/* STEP 3: REVIEW & EDIT */}
      {step === 3 && questions.length > 0 && (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Review Questions</h2>
            <span className="text-sm bg-gray-200 px-3 py-1 rounded">
              {metaData.className} &gt; {metaData.subject} &gt;{" "}
              {metaData.chapter}
            </span>
          </div>

          <QuestionForm
            data={questions[currentQIndex]}
            index={currentQIndex}
            total={questions.length}
            onSave={handleQuestionSave}
            onNext={handleNext}
            onPrev={handlePrev}
            onSubmit={handleFinalSubmit}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default AddQuestionsPage;