"use client";
import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

// Icons
import { IoMdGlobe } from "react-icons/io";

// Language Data
const languages = [
  { code: "en", label: "English", short: "EN", backendValue: "ENGLISH" },
  { code: "hin", label: "हिंदी", short: "HI", backendValue: "HINDI" },
  { code: "odi", label: "ଓଡିଆ", short: "OD", backendValue: "ODIA" },
];

interface UserSettings {
  email_notifications: boolean;
  theme: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  // Helper to find the backend value
  const getBackendMedium = (code: string) => {
    const lang = languages.find((l) => l.code === code);
    return lang ? lang.backendValue : "ENGLISH";
  };

  const changeLocale = async (newLocale: string) => {
    // 1. Immediate UI/Cookie Update
    document.cookie = `MYNEXTAPP_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    startTransition(() => {
      router.refresh();
    });

    // 2. Backend API Call
    const medium = getBackendMedium(newLocale);
    
    try {
      // Using PATCH since we are only updating one field
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`, {
        method: "PATCH", 
        headers: { 
          "Content-Type": "application/json" 
        },
        credentials: "include", // Important for passing auth cookies
        body: JSON.stringify({ medium: medium }),
      });

      if (!response.ok) {
        console.error("Failed to update language preference on backend");
      }
    } catch (error) {
      console.error("Error sending language update:", error);
    }
  };

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
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error("Error loading settings", err);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="p-6 mt-10 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Settings
        </h1>

        <div className="bg-white rounded-xl shadow border p-6 space-y-6 text-gray-700">
          
          {/* --- Language Section --- */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-50 rounded-full text-blue-600">
                <IoMdGlobe size={20} />
              </span>
              <span className="font-medium">Language</span>
            </div>
            
            <select
              value={locale}
              onChange={(e) => changeLocale(e.target.value)}
              disabled={isPending}
              className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none transition-all ${
                isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"
              }`}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label} ({lang.short})
                </option>
              ))}
            </select>
          </div>

          {/* --- Database Settings Section --- */}
          {settings ? (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="font-medium pl-2">📧 Email Notifications</span>
                <span
                  className={`font-semibold border px-4 cursor-pointer py-1.5 rounded-md text-sm ${
                    settings.email_notifications
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-600 border-red-200"
                  }`}
                >
                  {settings.email_notifications ? "Enabled" : "Disabled"}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium pl-2">🎨 Theme</span>
                <span className="font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-md text-sm border border-blue-100 uppercase">
                  {settings.theme}
                </span>
              </div>
            </>
          ) : (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-full"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}