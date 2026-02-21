"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/Authcontext";
import { useLocale, useTranslations } from "next-intl";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdAdminPanelSettings } from "react-icons/md";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import { IoHome } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { GiProgression } from "react-icons/gi";
import { TbLogout } from "react-icons/tb";

import KMLogo from "../assets/KM.png";
import dummyAvatar from "../assets/avatar.png";

interface NavLink {
  name: string;
  to: string;
  type: "route" | "scroll";
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  const menuRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations("Navbar");
  const [isPending, startTransition] = useTransition();

  // Simple Locale Change (No Backend Call)
  const changeLocale = (newLocale: string) => {
    document.cookie = `MYNEXTAPP_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => {
      router.refresh();
    });
  };

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
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname === "/Games") return null;

  const handleScrollOrRedirect = (link: NavLink) => {
    if (link.type === "scroll") {
      if (pathname !== "/") {
        router.push(`/${link.to}`);
      } else {
        document.querySelector(link.to)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      router.push(link.to);
    }
    setSidebarOpen(false); // Ensures sidebar closes on normal link click
  };

  const navLinks: NavLink[] = [
    { name: t("games"), to: "/Games", type: "route" },
    { name: t("home"), to: "#home", type: "scroll" },
    { name: t("product"), to: "#product", type: "scroll" },
  ];

  const navClasses = `fixed w-full top-0 z-50 transition-all duration-300 ${
    pathname === "/" && !isScrolled ? "bg-transparent text-white" : "bg-white text-gray-900 shadow-md"
  }`;

  if (loading) return null;

  return (
    <>
      <nav className={navClasses}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => router.push("/")}>
            <Image src={KMLogo} alt="Logo" className="h-10 w-auto" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <span
                key={link.name}
                onClick={() => handleScrollOrRedirect(link)}
                className="cursor-pointer relative group font-medium transition-colors duration-200 hover:text-red-500"
              >
                {link.name}
                {/* Animated underline effect */}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
              </span>
            ))}

            {/* Profile Dropdown (Always Visible) */}
            <div className="relative" ref={menuRef}>
              <div
                className="flex items-center gap-2 cursor-pointer border border-gray-200 rounded-full p-1 hover:shadow-md transition bg-white"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <Image
                  src={user?.image || dummyAvatar}
                  alt="user"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              </div>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white shadow-xl rounded-lg w-56 py-2 border border-gray-100 text-gray-700 z-50">
                  <ul className="flex flex-col text-sm">
                    {/* Public / Logged Out Options */}
                    {!user ? (
                      <>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3" onClick={() => { router.push("/"); setIsUserMenuOpen(false); }}>
                          <IoHome size={18} /> Home
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-blue-600 font-semibold" onClick={() => { router.push("/Login"); setIsUserMenuOpen(false); }}>
                          Login
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500 font-semibold" onClick={() => { router.push("/Signup"); setIsUserMenuOpen(false); }}>
                          Sign Up
                        </li>
                      </>
                    ) : (
                      /* Logged In Options */
                      <>
                        <li className="px-4 py-3 border-b border-gray-50 mb-1 bg-gray-50/50">
                          <p className="font-bold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{user.type}</p>
                        </li>
                        
                        {user.type === "admin" && (
                          <>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3" onClick={() => { router.push("/Dashboard"); setIsUserMenuOpen(false); }}>
                              <MdAdminPanelSettings size={18} className="text-red-500" /> Admin Panel
                            </li>
                            {/* <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3" onClick={() => { router.push("/AdminAdd"); setIsUserMenuOpen(false); }}>
                              <span className="font-bold text-red-500">+</span> Add Exercise
                            </li> */}
                          </>
                        )}

                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3" onClick={() => { router.push("/UserDashboard"); setIsUserMenuOpen(false); }}>
                          <LuLayoutDashboard size={18} /> 
                          {user.type === "admin" ? "User Dashboard" : "Dashboard"}
                        </li>
                        
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3" onClick={() => { router.push("/Progress"); setIsUserMenuOpen(false); }}>
                          <GiProgression size={18} /> Progress
                        </li>

                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3" onClick={() => { router.push("/Setting"); setIsUserMenuOpen(false); }}>
                          <IoMdSettings size={18} /> Settings
                        </li>

                        <hr className="my-1 border-gray-100" />
                        
                        <li className="px-4 py-2 hover:bg-red-50 cursor-pointer flex items-center gap-3 text-red-600 font-medium transition-colors" onClick={() => { logout(); router.push("/Login"); setIsUserMenuOpen(false); }}>
                          <TbLogout size={18} /> Logout
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setSidebarOpen(true)} className="md:hidden">
            <RxHamburgerMenu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />}

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 h-screen w-[80%] max-w-sm bg-white z-[70] shadow-2xl transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col overflow-y-auto`}>
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <Image src={KMLogo} alt="Logo" className="h-8 w-auto" />
          <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
             <RxCross1 size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 flex flex-col space-y-4">
          {/* Mobile Nav Links */}
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <span 
                key={link.name} 
                onClick={() => {
                  handleScrollOrRedirect(link);
                  setSidebarOpen(false); 
                }} 
                className="text-lg font-medium border-b border-gray-100 pb-2 hover:text-red-500 transition-colors cursor-pointer"
              >
                {link.name}
              </span>
            ))}
          </div>

          {!user ? (
            <div className="flex flex-col gap-3 pt-4">
              <button 
                onClick={() => { router.push("/Login"); setSidebarOpen(false); }} 
                className="w-full py-2.5 border-2 border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-50 active:scale-95 transition-all"
              >
                Login
              </button>
              <button 
                onClick={() => { router.push("/Signup"); setSidebarOpen(false); }} 
                className="w-full py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 active:scale-95 transition-all shadow-md"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5 pt-4">
               {/* User Info Header */}
               <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <Image src={user.image || dummyAvatar} alt="user" width={48} height={48} className="rounded-full shadow-sm" />
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 text-lg">{user.name}</span>
                  <span className="text-sm text-gray-500 capitalize">{user.type}</span>
                </div>
              </div>

              {/* Admin Specific Links */}
              {user.type === "admin" && (
                <>
                  <button 
                    onClick={() => { router.push("/Dashboard"); setSidebarOpen(false); }} 
                    className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-red-500 transition-colors w-full text-left"
                  >
                    <MdAdminPanelSettings size={22} className="text-red-500" /> Admin Panel
                  </button>
                  {/* <button 
                    onClick={() => { router.push("/AdminAdd"); setSidebarOpen(false); }} 
                    className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-red-500 transition-colors w-full text-left"
                  >
                    <span className="w-5.5 h-5.5 flex items-center justify-center font-bold text-xl text-red-500">+</span> Add Exercise
                  </button> */}
                </>
              )}

              {/* Shared Logged-in Links */}
              <button 
                onClick={() => { router.push("/UserDashboard"); setSidebarOpen(false); }} 
                className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-red-500 transition-colors w-full text-left"
              >
                <LuLayoutDashboard size={20} className="text-gray-500" /> 
                {user.type === "admin" ? "User Dashboard" : "Dashboard"}
              </button>
              
              <button 
                onClick={() => { router.push("/Progress"); setSidebarOpen(false); }} 
                className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-red-500 transition-colors w-full text-left"
              >
                <GiProgression size={20} className="text-gray-500" /> Progress
              </button>

              <button 
                onClick={() => { router.push("/Setting"); setSidebarOpen(false); }} 
                className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-red-500 transition-colors w-full text-left"
              >
                <IoMdSettings size={20} className="text-gray-500" /> Settings
              </button>

              <hr className="border-gray-100 my-2" />

              <button 
                onClick={() => { logout(); setSidebarOpen(false); router.push("/Login"); }} 
                className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 active:scale-95 transition-all"
              >
                <TbLogout size={22} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;