"use client";

import React from "react";
import Image from "next/image"; // Import the Next.js Image component
import { motion } from "framer-motion";

import KMDevice from "../assets/signal-2025-04-18-221311.png";

export default function ProductIntro() {
  return (
    <section
      id="product"
      className="min-h-screen px-4 sm:px-8 py-20 bg-gradient-to-br to-[#fde2e4] via-[#fff1e6] from-[#ab79cfba] text-center font-poppins"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-6xl mx-auto space-y-10"
      >
        <h2 className="text-3xl sm:text-6xl font-extrabold font-poppins text-[#483D8B] leading-snug">
          Introducing KM Numeric
        </h2>

        <div className="grid md:grid-cols-2 gap-10 items-center text-left">
          <div className="md:w-full">
            <Image // Use the Next.js Image component
              src={KMDevice}
              alt="KM Numeric Device"
              width={500}  // You must provide width and height
              height={320} // You must provide width and height
              className="w-full h-full shadow-md max-h-[320px] object-contain rounded-lg mx-auto"
            />
          </div>

          <div className="space-y-6 text-gray-800 text-base sm:text-lg">
            <div>
              <span className="font-bold text-[#a00038]">
                Child-centric Design:
              </span>{" "}
              Built ergonomically with playful activities for kids to enjoy.
            </div>
            <div>
              <span className="font-bold text-[#a00038]">
                Positive Learning Habit:
              </span>{" "}
              Makes numeracy a joyful, addictive experience.
            </div>
            <div>
              <span className="font-bold text-[#a00038]">
                Tailored for Bharat:
              </span>{" "}
              Multilingual support and rooted in Indian values.
            </div>
            <div>
              <span className="font-bold text-[#a00038]">Made in India:</span>{" "}
              Completely indigenous — hardware, OS, and content.
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}