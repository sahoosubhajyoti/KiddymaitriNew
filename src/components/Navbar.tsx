"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/Authcontext";
import { useLocale, useTranslations } from "next-intl";
import { LuLayoutDashboard } from "react-icons/lu"; // For User Dashboard
import { MdAdminPanelSettings } from "react-icons/md"; // For Admin Dashboard
// Icons
import { RxHamburgerMenu, RxCross1, RxChevronDown } from "react-icons/rx";
import { IoHome } from "react-icons/io5";
import { IoMdSettings, IoMdGlobe } from "react-icons/io";
import { GiProgression } from "react-icons/gi";
import { TbLogout } from "react-icons/tb";

import KMLogo from "../assets/KM.png";
import dummyAvatar from "../assets/avatar.png";

interface NavLink {
  name: string;
  to: string;
  type: "route" | "scroll";
}

const languages = [
  { code: "en", label: "English", short: "EN", backendValue: "ENGLISH" },
  { code: "hin", label: "हिंदी", short: "HI", backendValue: "HINDI" },
  { code: "odi", label: "ଓଡିଆ", short: "OD", backendValue: "ODIA" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dropdown States
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  const menuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const locale = useLocale();
  const t = useTranslations("Navbar");
  const [isPending, startTransition] = useTransition();

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  const changeLocale = async (newLocale: string) => {
    document.cookie = `MYNEXTAPP_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    startTransition(() => {
      router.refresh();
      setIsLangMenuOpen(false);
    });

    if (user) {
      const langData = languages.find((l) => l.code === newLocale);
      const medium = langData ? langData.backendValue : "ENGLISH";

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ medium: medium }),
          },
        );

        if (!response.ok) {
          console.error("Failed to update language preference on backend");
        }
      } catch (error) {
        console.error("Error syncing language preference:", error);
      }
    }
  };

  // ✅ 1. HOOKS MUST RUN FIRST (Moved useEffects UP)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const isHome = pathname === "/";

    if (isHome) {
      window.addEventListener("scroll", handleScroll);
      handleScroll();
    } else {
      setIsScrolled(true);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(target)) {
        setIsLangMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ 2. EARLY RETURN CHECK (Placed AFTER all hooks)
  if (pathname === "/Games") {
    return null;
  }

  const handleScrollOrRedirect = (link: NavLink) => {
    if (link.type === "scroll") {
      if (pathname !== "/") {
        router.push(`/${link.to}`);
      } else {
        document.querySelector(link.to)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      router.push(link.to);
    }
    setSidebarOpen(false);
  };

  const navLinks: NavLink[] = [
    { name: t("games"), to: "/Games", type: "route" },
    //{ name: t("shop"), to: "/shop", type: "route" },
    { name: t("home"), to: "#home", type: "scroll" },
    { name: t("product"), to: "#product", type: "scroll" },
    { name: t("testimonials"), to: "#testimonials", type: "scroll" },
    { name: t("news"), to: "#news", type: "scroll" },
  ];

  const navClasses = `fixed w-full top-0 z-50 transition-all duration-300 ${
    pathname === "/" && !isScrolled
      ? "bg-transparent text-white"
      : "bg-white text-gray-900 shadow-md"
  }`;

  if (loading) {
    return (
      <div className="fixed w-full top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className={navClasses}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            onClick={() =>
              handleScrollOrRedirect({
                name: "Home",
                to: "#home",
                type: "scroll",
              })
            }
          >
            <Image
              src={KMLogo}
              alt="Logo"
              className="h-10 w-auto cursor-pointer"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <span
                key={link.name}
                onClick={() => handleScrollOrRedirect(link)}
                className="cursor-pointer relative group transition duration-300"
              >
                {link.name}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </span>
            ))}

            {/* Language Dropdown */}
            <div className="relative ml-4" ref={langMenuRef}>
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  pathname === "/" && !isScrolled
                    ? "border-white/50 hover:bg-white/10"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                <IoMdGlobe size={18} />
                <span className="text-sm font-medium mx-1">
                  {currentLang.label}
                </span>
                <RxChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isLangMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-md shadow-lg py-1 border border-gray-100 overflow-hidden z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLocale(lang.code)}
                      disabled={isPending}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        locale === lang.code
                          ? "text-blue-600 font-semibold bg-blue-50"
                          : "text-gray-700"
                      } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Auth Section */}
            {user?.type === undefined ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push("/Login")}
                  className="transition duration-300 hover:text-red-500"
                >
                  {t("login")}
                </button>
                <button
                  onClick={() => router.push("/Signup")}
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                >
                  {t("signup")}
                </button>
              </div>
            ) : (
              <div className="relative flex items-center gap-4" ref={menuRef}>
               

                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                >
                  <Image
                    src={user.image || dummyAvatar}
                    alt="user"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                </div>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-4 bg-white shadow-lg rounded-md w-56 flex-col transition-all duration-200 z-50 flex border border-gray-100">
                    <ul className="flex flex-col text-sm text-gray-700 py-2">
                      <li
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          router.push("/#home");
                          setIsUserMenuOpen(false);
                        }}
                      >
                        <IoHome size={18} />
                        <span>Home</span>
                      </li>
                      {user.type === "admin" && (
                        <li className="px-4 py-2">
                          <button
                            onClick={() => {
                              setSidebarOpen(false);
                              router.push("/AdminAdd");
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-center py-1.5 bg-gray-100 rounded-full hover:bg-gray-200 text-xs font-semibold transition"
                          >
                            Add Exercise
                          </button>
                        </li>
                        
                        
                      )}
                        {user.type === "admin" && (
                        <li
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          router.push("/Dashboard");
                          setIsUserMenuOpen(false);
                        }}
                      >
                       <MdAdminPanelSettings size={20} />
                        <span>AdminDashboard</span>
                      </li>
                        
                        
                      )}
                      <li
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          router.push("/Progress");
                          setIsUserMenuOpen(false);
                        }}
                      >
                        <GiProgression size={18} />
                        <span>Progress</span>
                      </li>
                      <li
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          router.push("/UserDashboard");
                          setIsUserMenuOpen(false);
                        }}
                      >
                        <LuLayoutDashboard size={18} className="text-gray-500" />
                        <span>{user.type==="admin"?"UserDashboard":"Dashboard"}</span>
                      </li>
                      <li
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          router.push("/Setting");
                          setIsUserMenuOpen(false);
                        }}
                      >
                        <IoMdSettings size={18} />
                        <span>Setting</span>
                      </li>
                      <hr className="my-1 border-gray-100" />
                      <li className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">
                        <TbLogout size={18} />
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            router.push("/Login");
                            setIsUserMenuOpen(false);
                          }}
                          className="text-left w-full"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button onClick={() => setSidebarOpen(true)} className="md:hidden">
            <RxHamburgerMenu size={28} />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Mobile) */}
      <div
        className={`fixed top-0 left-0 h-screen w-[80%] max-w-sm bg-white z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto flex flex-col shadow-2xl`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Image src={KMLogo} alt="Logo" className="h-8 w-auto" />
          <button onClick={() => setSidebarOpen(false)}>
            <RxCross1 size={24} />
          </button>
        </div>

        <div className="flex-grow flex flex-col p-6 space-y-6">
          {/* Mobile Nav Links - Automatically includes Games */}
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <span
                key={link.name}
                onClick={() => handleScrollOrRedirect(link)}
                className="text-lg font-medium text-gray-800 hover:text-red-500 transition cursor-pointer"
              >
                {link.name}
              </span>
            ))}
          </div>

          <hr className="border-gray-200" />

          {/* Mobile Language Section */}
          <div className="space-y-3">
            <h3 className="text-sm uppercase text-gray-400 font-bold tracking-wider flex items-center gap-2">
              <IoMdGlobe /> Language
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLocale(lang.code)}
                  disabled={isPending}
                  className={`px-3 py-2 text-sm font-medium rounded-md border transition-all ${
                    locale === lang.code
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Mobile user menu */}
          {/* Mobile user menu */}
          {!user ? (
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => router.push("/Login")}
                className="w-full py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition font-medium"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/Signup")}
                className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium shadow-md"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {/* User Profile Header */}
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <Image
                  src={user.image || dummyAvatar}
                  alt="user"
                  width={40}
                  height={40}
                  className="rounded-full object-cover border border-gray-200"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-500">Logged in</span>
                </div>
              </div>

              {/* Menu Links */}
              <div className="flex flex-col space-y-4 pl-2">
                <button
                  type="button"
                  onClick={() => {
                    router.push("/UserDashboard");
                    setSidebarOpen(false);
                  }}
                  className="flex items-center gap-3 text-left font-medium text-gray-700 hover:text-blue-600 transition"
                >
                  <IoHome size={20} />
                  <span>{user.type==="admin"?"UserDashboard":"Dashboard"}</span>
                </button>

                {/* Admin Add (Matches Desktop Logic) */}
                {user.type === "admin" && (
                  <button
                    type="button"
                    onClick={() => {
                      router.push("/AdminAdd");
                      setSidebarOpen(false);
                    }}
                    className="flex items-center gap-3 text-left font-medium text-gray-700 hover:text-blue-600 transition"
                  >
                    {/* You might want to import a specific icon for this, or reuse one */}
                    <span className="w-5 h-5 flex items-center justify-center font-bold text-lg">
                      +
                    </span>
                    <span>Add Exercise</span>
                  </button>
                )}
                {user.type==="admin" && (
                  <button
                  type="button"
                  onClick={() => {
                    router.push("/Dashboard");
                    setSidebarOpen(false);
                  }}
                  className="flex items-center gap-3 text-left font-medium text-gray-700 hover:text-blue-600 transition"
                >
                  <IoHome size={20} />
                  <span>AdminDashboard</span>
                </button>
                )}

                {/* Progress */}
                <button
                  type="button"
                  onClick={() => {
                    router.push("/Progress");
                    setSidebarOpen(false);
                  }}
                  className="flex items-center gap-3 text-left font-medium text-gray-700 hover:text-blue-600 transition"
                >
                  <GiProgression size={20} />
                  <span>Progress</span>
                </button>

                {/* Setting */}
                <button
                  type="button"
                  onClick={() => {
                    router.push("/Setting");
                    setSidebarOpen(false);
                  }}
                  className="flex items-center gap-3 text-left font-medium text-gray-700 hover:text-blue-600 transition"
                >
                  <IoMdSettings size={20} />
                  <span>Setting</span>
                </button>
              </div>

              <hr className="border-gray-100" />

              {/* Logout */}
              <button
                onClick={() => {
                  logout();
                  router.push("/Login");
                }}
                className="flex items-center justify-center gap-2 w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                <TbLogout size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
