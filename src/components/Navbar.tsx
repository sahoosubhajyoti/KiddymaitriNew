"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import { IoHome } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { GiProgression } from "react-icons/gi";
import { TbLogout } from "react-icons/tb";
import { useAuth } from "../context/Authcontext"; // Make sure this exists

import KMLogo from "../assets/KM.png"; // Your logo
import dummyAvatar from "../assets/avatar.png"; // dumy avatar

interface NavLink {
  name: string;
  to: string;
  type: "route" | "scroll";
}

const navLinks: NavLink[] = [
  { name: "Shop", to: "/shop", type: "route" },
  { name: "Home", to: "#home", type: "scroll" },
  { name: "Product", to: "#product", type: "scroll" },
  { name: "Testimonials", to: "#testimonials", type: "scroll" },
  { name: "News", to: "#news", type: "scroll" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const loading = false;
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
     const menuRef = useRef<HTMLDivElement>(null);
//  console.log("user:", user); // Debugging line to check user state
  // Assuming `logout` exists

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);

    if (isHome) {
      window.addEventListener("scroll", handleScroll);
      handleScroll();
    } else {
      setIsScrolled(true);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

 
  useEffect(() => {
    // FIX: Add the 'MouseEvent' type to the event parameter
    function handleClickOutside(event: MouseEvent) {
      // If clicked outside the menu element
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    // Listen for clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // The ref is stable, so the dependency array is correct as empty

  const handleScrollOrRedirect = (link: NavLink) => {
    if (link.type === "scroll") {
      if (!isHome) {
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

  const navClasses = `fixed w-full top-0  z-50 transition-all duration-300 ${
    isHome && !isScrolled
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
        <div className="max-w-7xl mx-auto  px-4 py-3 flex justify-between items-center">
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
          <div className="hidden md:flex  items-center space-x-6">
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

            {/* If user logged in → Profile dropdown, else → Sign Up */}
            {user?.type === undefined ? (
             <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push("/Login")}
                  className="transition duration-300 hover:text-red-500"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/Signup")}
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="relative flex items-center gap-4" ref={menuRef}>
                {/* Dashboard */}
                <div className="relative group cursor-pointer">
                  <button
                    type="button"
                    onClick={() => router.push("/Dashboard")}
                    className="transition duration-300 cursor-pointer"
                  >
                    Dashboard
                  </button>
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                </div>

                {/* Profile Menu */}
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
                  <span className="text-sm font-medium">{user.name}</span>
                </div>

                {isUserMenuOpen && (
                  <div className="absolute right-4 top-full mt-4 bg-white shadow-lg rounded-md w-46 flex-col transition-all duration-200 z-50 flex">
                    <ul className="flex flex-col text-base text-gray-700 p-3">
                      <li
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={() => {
                          router.push("/#home");
                          setIsUserMenuOpen(false);
                        }}
                      >
                        <IoHome size={20} />
                        <span>Home</span>
                      </li>
                       {/* Conditional rendering for 'Add Exercise' on mobile */}
              {user.type === "admin" && (
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                              router.push("/Exercise");
                              setIsUserMenuOpen(false);
                  }}
                  className="px-6 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition duration-300"
                >
                  Add Exercise
                </button>
              )}
                      <li
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={() => {
                          router.push("/Progress");
                          setIsUserMenuOpen(false);
                        }}
                      >
                        <GiProgression size={20} />
                        <span>Progress</span>
                      </li>
                      <li
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={() => {
                          router.push("/Setting");
                          setIsUserMenuOpen(false);
                        }}
                      >
                        <IoMdSettings size={20} />
                        <span>Setting</span>
                      </li>
                      <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded">
                        <TbLogout size={20} />
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
        className={`fixed top-0 left-0 h-screen w-full bg-white z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Image src={KMLogo} alt="Logo" className="h-8 w-auto" />
          <button onClick={() => setSidebarOpen(false)}>
            <RxCross1 size={24} />
          </button>
        </div>
        <div className="flex-grow flex flex-col items-center space-y-6 text-xl font-medium p-10">
          {navLinks.map((link) => (
            <span
              key={link.name}
              onClick={() => handleScrollOrRedirect(link)}
              className="text-gray-800 hover:text-red-500 transition cursor-pointer"
            >
              {link.name}
            </span>
          ))}

          {/* Mobile user menu */}
          {!user ? (
           <div className="flex items-center space-x-2">
                <button
                  onClick={() => router.push("/Login")}
                  className="transition duration-300 hover:text-red-500"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/Signup")}
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                >
                  Sign Up
                </button>
              </div>
          ) : (
            <>
              <button
                type="button"
                  onClick={() => { router.push("/Dashboard"); setSidebarOpen(false)}}
                className="text-gray-800"
              >
                Dashboard
              </button>
              <div className="flex flex-col items-center gap-2">
                <Image
                  src={user.image || dummyAvatar}
                  alt="user"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <span>{user.name}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push("/Login");
                }}
                className="px-6 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
