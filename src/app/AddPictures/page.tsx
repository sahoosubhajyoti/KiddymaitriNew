"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/Authcontext"; 
import Link from "next/link";

export default function AddPictures() {
  const { user } = useAuth();
  const router = useRouter();

  // --- STATE ---
  const [formData, setFormData] = useState({
    name: "",
    group_name: "", 
    is_active: true,
  });

  const [file, setFile] = useState<File | null>(null);
  const [existingGroups, setExistingGroups] = useState<string[]>([]);
  const [isNewGroupMode, setIsNewGroupMode] = useState(false); // Controls Dropdown vs Input
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // --- 1. FETCH GROUPS ON LOAD ---
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/colouring/groups/`,
            {method:"GET",
            credentials:"include",
            }
        );
        if (res.ok) {
          const data = await res.json();
          // Assuming the API returns an array of strings: ["Animals", "Vehicles", ...]
          // If it returns objects like [{name: "Animals"}], change to data.map(g => g.name)
          if (Array.isArray(data) && data.length > 0) {
            setExistingGroups(data);
            setFormData(prev => ({ ...prev, group_name: data[0] })); // Default to first group
            setIsNewGroupMode(false);
          } else {
            // No groups found, force manual entry
            setIsNewGroupMode(true);
          }
        }
      } catch (err) {
        console.error("Error fetching groups:", err);
        setIsNewGroupMode(true); // Fallback to manual mode on error
      }
    };

    fetchGroups();
  }, []);

  // --- HANDLERS ---
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, is_active: e.target.checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Strict SVG Validation
      if (selectedFile.type !== "image/svg+xml" && !selectedFile.name.endsWith(".svg")) {
        setMessage("Error: Only .svg files are allowed.");
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setMessage(""); 
    }
  };

  const toggleGroupMode = () => {
    setIsNewGroupMode(!isNewGroupMode);
    // Clear group name when switching so user doesn't accidentally submit wrong data
    setFormData(prev => ({ ...prev, group_name: "" }));
    
    // If switching BACK to dropdown, select the first existing group again
    if (isNewGroupMode && existingGroups.length > 0) {
      setFormData(prev => ({ ...prev, group_name: existingGroups[0] }));
    }
  };

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return router.push("/login");

    if (!file) {
      setMessage("Please upload an SVG file.");
      return;
    }

    if (!formData.group_name.trim()) {
      setMessage("Please provide a Group Name.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const dataToSend = new FormData();
      dataToSend.append("group_name", formData.group_name);
      dataToSend.append("name", formData.name);
      dataToSend.append("image", file);
      // Convert boolean to string for FormData (Python handles 'true'/'True' usually, or use 'True' if strict)
      dataToSend.append("is_active", formData.is_active ? "True" : "False");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/colouring/add/`,
        {
          method: "POST",
           
          // Content-Type is set automatically by browser for FormData
           credentials: "include",
          body: dataToSend,
        }
      );

      if (response.ok) {
        setMessage("Success: Picture added!");
        // Reset specific fields
        setFormData(prev => ({ ...prev, name: "" })); 
        setFile(null);
        // We do NOT reset group_name here so they can easily add another to the same group
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${JSON.stringify(errorData)}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Something went wrong connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-xl border border-gray-100">
      
      {/* Header & Back Link */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Add Colouring Picture</h2>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1">
           &larr; Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Picture Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleTextChange}
            required
            placeholder="e.g. Baby Elephant"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* 2. Group Selection (The Logic Catch) */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Group Category</label>
            
            {/* Toggle Button (Only show if we actually have existing groups) */}
            {existingGroups.length > 0 && (
              <button 
                type="button"
                onClick={toggleGroupMode}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
              >
                {isNewGroupMode ? "Select Existing Group" : "+ Create New Group"}
              </button>
            )}
          </div>

          {/* Logic: Show Input if New Mode OR No Groups Exist. Otherwise show Dropdown. */}
          {isNewGroupMode || existingGroups.length === 0 ? (
            <input
              type="text"
              name="group_name"
              value={formData.group_name}
              onChange={handleTextChange}
              required
              placeholder="Type new group name..."
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            />
          ) : (
            <select
              name="group_name"
              value={formData.group_name}
              onChange={handleTextChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
            >
              {existingGroups.map((group, idx) => (
                <option key={idx} value={group}>
                  {group}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 3. File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload SVG <span className="text-red-500">*</span>
          </label>
          <div className={`border-2 border-dashed rounded-lg p-6 text-center ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'}`}>
            <input 
              type="file" 
              accept=".svg"
              onChange={handleFileChange}
              className="hidden" 
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              {!file ? (
                <>
                  <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  <span className="text-sm text-gray-500">Click to upload SVG</span>
                </>
              ) : (
                <>
                  <svg className="w-8 h-8 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-sm font-medium text-green-700">{file.name}</span>
                  <span className="text-xs text-green-600 mt-1">Change file</span>
                </>
              )}
            </label>
          </div>
        </div>

        {/* 4. Is Active Checkbox */}
        <div className="flex items-center">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={formData.is_active}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
            Is Active?
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-medium text-white transition-all ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? "Uploading..." : "Add Picture"}
        </button>

      </form>

      {/* Messages */}
      {message && (
        <div className={`mt-6 p-4 rounded text-center text-sm ${message.includes("Success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message}
        </div>
      )}
    </div>
  );
}
