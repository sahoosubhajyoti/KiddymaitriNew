"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAuth } from "../../context/Authcontext"; // ✅ Import your Auth Context
import api from "../../utility/axiosInstance";

// Icons
import { IoMdGlobe } from "react-icons/io";
import { FaGraduationCap } from "react-icons/fa6";

const languages = [
  { code: "en", label: "English", short: "EN", backendValue: "ENGLISH" },
  { code: "hin", label: "हिंदी", short: "HI", backendValue: "HINDI" },
  { code: "odi", label: "ଓଡିଆ", short: "OD", backendValue: "ODIA" },
];

// Define the expected structure from your API
interface ClassOption {
  id: string | number;
  name: string;
}

interface UserSettings {
  email_notifications: boolean;
  theme: string;
}

export default function SettingsPage() {
  const { user, setUser } = useAuth(); // ✅ Get user and setUser from Context
  const [dbSettings, setDbSettings] = useState<UserSettings | null>(null);
  
  // ✅ New state to hold fetched classes
  const [classes, setClasses] = useState<ClassOption[]>([]);
  
  const router = useRouter();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const getBackendMedium = (code: string) => {
    const lang = languages.find((l) => l.code === code);
    return lang ? lang.backendValue : "ENGLISH";
  };

  // ✅ Handle Class Change & Sync with LocalStorage/Context
  const changeClassNum = async (newClassNum: string) => {
    if (!user) return;

    // 1. Update Global Context & LocalStorage immediately
    const updatedUser = { ...user, class_num: newClassNum };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    try {
      // 2. Sync with Backend
      await api.patch('/profile', { class_num: Number(newClassNum) });
    } catch (error) {
      console.error("Error updating class number:", error);
    }
  };

  const changeLocale = async (newLocale: string) => {
    document.cookie = `MYNEXTAPP_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => { router.refresh(); });

    try {
      const medium = getBackendMedium(newLocale);
      await api.patch('/profile', { medium });
      
      // Also update language in global state
      if (user) {
        const updatedUser = { ...user, language: medium };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error sending language update:", error);
    }
  };

  // ✅ Fetch dynamic classes from API on mount
  useEffect(() => {
  const fetchClasses = async () => {
    try {
      console.log("1. Starting to fetch classes...");
      
      // Using your Axios instance (recommended)
      const res = await api.get('/mcq/user/classes/');
      
      console.log("2. API Response Data:", res.data);

      // Check if results exist
      if (res.data && Array.isArray(res.data.results)) {
        console.log("3. Setting classes to:", res.data.results);
        setClasses(res.data.results);
      } else {
        console.error("❌ 'results' array is missing from the response!", res.data);
      }
    } catch (err) {
      console.error("❌ Error fetching classes:", err);
    }
  };

    fetchClasses();
  }, []);

  // Fetch user settings
  useEffect(() => {
    const fetchDbSettings = async () => {
      try {
        const response = await api.get('/settings');
        setDbSettings(response.data);
      } catch (err) {
        console.error("Error loading settings", err);
      }
    };
    fetchDbSettings();
  }, []);

  return (
    <div className="p-6 mt-10 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Settings</h1>

        <div className="bg-white rounded-xl shadow border p-6 space-y-6 text-gray-700">
          
          {/* --- Language Section --- */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-50 rounded-full text-blue-600"><IoMdGlobe size={20} /></span>
              <span className="font-medium">Language</span>
            </div>
            <select
              value={locale}
              onChange={(e) => changeLocale(e.target.value)}
              disabled={isPending}
              className="bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5 outline-none"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>

          {/* --- Academic Class Section (From LocalStorage/Context) --- */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-50 rounded-full text-blue-600"><FaGraduationCap size={20} /></span>
              <div className="flex flex-col">
                <span className="font-medium">Academic Class</span>
                {!user?.class_num && (
                  <span className="text-xs text-red-500 font-semibold">Action Required: Select Class</span>
                )}
              </div>
            </div>

            {/* ✅ Dynamic Class Dropdown mapped from API state */}
           <select
              value={user?.class_num || ""}
              onChange={(e) => changeClassNum(e.target.value)}
              className={`bg-gray-50 border text-sm rounded-lg p-2.5 outline-none transition-all ${
                !user?.class_num ? "border-red-400 ring-2 ring-red-100" : "border-gray-300"
              }`}
            >
              <option value="" disabled>Select Class</option>
              
              {/* Show loading state if array is empty */}
              {classes.length === 0 ? (
                <option value="" disabled>Loading classes...</option>
              ) : (
                /* Map over the results */
                classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))
              )}
            </select>
          </div>

          {/* --- Database Settings (Notifications/Theme) --- */}
          {dbSettings ? (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="font-medium pl-2">📧 Email Notifications</span>
                <span className={`font-semibold px-4 py-1.5 rounded-md text-sm border ${
                  dbSettings.email_notifications ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"
                }`}>
                  {dbSettings.email_notifications ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium pl-2">🎨 Theme</span>
                <span className="font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-md text-sm border border-blue-100 uppercase">
                  {dbSettings.theme}
                </span>
              </div>
            </>
          ) : (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}