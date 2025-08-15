"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/Authcontext";

export default function AddExercise() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    exg_name: "",
    exg_class: "",
    exr_list: "",
    exg_code: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/exercise/add/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Send cookies/session if required
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Exercise added successfully!");
        setFormData({
          exg_name: "",
          exg_class: "",
          exr_list: "",
          exg_code: "",
        });
      } else {
        setMessage(data.error || "Failed to add exercise.");
      }
    } catch (err) {
      console.error("Failed to add exercise:", err); // Log the actual error
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl  mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">
        Add New Exercise
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">
            Exercise Name
          </span>
          <input
            type="text"
            name="exg_name"
            value={formData.exg_name}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">
            Exercise Class
          </span>
          <input
            type="text"
            name="exg_class"
            value={formData.exg_class}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">
            Exercise List
          </span>
          <input
            type="text"
            name="exr_list"
            value={formData.exr_list}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">
            Exercise Code
          </span>
          <textarea
            name="exg_code"
            value={formData.exg_code}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded font-mono"
            rows={30}
            style={{ resize: "vertical" }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded"
        >
          {loading ? "Adding..." : "Add Exercise"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-red-500">{message}</p>
      )}
    </div>
  );
}
