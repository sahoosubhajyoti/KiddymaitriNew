// components/LanguageSwitcher.jsx
"use client";
// CORRECT
import { useRouter, usePathname } from "next-intl/navigation";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (locale) => {
    // This navigates to the same page, but with a different locale
    router.replace(pathname, { locale: locale });
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => changeLanguage('en')}
        className="font-bold text-sm"
      >
        EN
      </button>
      <span>|</span>
      <button 
        onClick={() => changeLanguage('hin')}
        className="font-bold text-sm"
      >
        HIN
      </button>
    </div>
  );
}