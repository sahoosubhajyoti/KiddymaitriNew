"use client";

import { FaYoutube, FaTwitter } from "react-icons/fa";
import { useRouter } from "next/navigation";
import React from "react";

const Footer: React.FC = () => {
  const router = useRouter();

  return (
    <footer className="bg-white text-gray-800 py-10 px-5 md:px-10 font-poppins">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
        {/* Company */}
        <div>
          <h4 className="font-semibold mb-2 text-gray-900">Company</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li
              onClick={() => router.push("/About")}
              className="cursor-pointer hover:text-blue-600 transition"
            >
              About
            </li>
            <li
              onClick={() => router.push("/Careers")}
              className="cursor-pointer hover:text-blue-600 transition"
            >
              Careers
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold mb-2 text-gray-900">Support</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li
              onClick={() => router.push("/Contact")}
              className="cursor-pointer hover:text-blue-600 transition"
            >
              Contact
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold mb-2 text-gray-900">Legal</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li
              onClick={() => router.push("/Privacy-Policy")}
              className="cursor-pointer hover:text-blue-600 transition"
            >
              Privacy Policy
            </li>
            <li
              onClick={() => router.push("/Terms-Services")}
              className="cursor-pointer hover:text-blue-600 transition"
            >
              Terms of Service
            </li>
            <li
              onClick={() => router.push("/Shipping-Policy")}
              className="cursor-pointer hover:text-blue-600 transition"
            >
              Shipping Policy
            </li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h4 className="font-semibold mb-2 text-gray-900">Social</h4>
          <div className="flex justify-center md:justify-start gap-4 items-center">
            <a
              href="https://www.youtube.com/@kiddymaitri"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-400 transition text-xl"
            >
              <FaYoutube />
            </a>
            <a
              href="https://x.com/kiddymaitri"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-300 transition text-xl"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      <div className="w-full h-0.5 bg-gray-200 mt-8 leading-1"></div>

      {/* Copyright */}
      <div className="text-center mt-6 text-sm text-gray-500">
        <span className="text-gray-600">©</span> 2025{" "}
        <span className="text-gray-700">Kiddymaitri</span> All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
