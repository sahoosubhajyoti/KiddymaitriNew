"use client";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/settings`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const data = await res.json();
        console.log(data);
        setSettings(data);
      } catch (err) {
        console.error("Error loading settings", err);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="p-6 mt-10 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Settings
      </h1>

      {settings ? (
        <div className="bg-white  rounded-xl shadow border p-6 space-y-4 text-gray-700">
          <div className="flex items-center justify-between">
            <span className="font-medium">📧 Email Notifications</span>
            <span
              className={`font-semibold border px-4 cursor-pointer py-2 rounded-md  ${
                settings.email_notifications ? "text-green-600" : "text-red-500"
              }`}
            >
              {settings.email_notifications ? "On" : "Off"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium"> Theme</span>
            <span className="font-semibold text-blue-600">
              {settings.theme}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 italic">Loading settings...</p>
      )}
    </div>
  );
}
