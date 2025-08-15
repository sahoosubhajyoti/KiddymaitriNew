"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import crisisBgRemoved from "../assets/crisis-removebg-preview.png";
import solution from "../assets/solution.jpg";

const CrisisSection = () => {
  return (
    <section
      id="crisis" // Corrected ID to match the Navbar's scroll link
      className="min-h-screen px-4 sm:px-8 py-20 bg-gradient-to-br from-[#932ddcba] via-[#f8b8c9] to-[#fdf1f3] text-center font-poppins"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Title */}
        <h2 className="text-3xl sm:text-5xl font-extrabold font-poppins text-[#efefef] leading-snug">
          The Crisis We Can’t Ignore
        </h2>

        {/* Crisis Content */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-left">
          <div className="md:w-2/3">
            <p className="text-lg sm:text-xl text-gray-800 mb-4 leading-relaxed">
              India is facing a{" "}
              <span className="text-red-600 font-semibold">
                foundational numeracy crisis
              </span>{" "}
              — millions of children in early grades cannot perform basic math
              operations, threatening their entire educational journey.
            </p>
            <p className="text-base sm:text-lg text-gray-800">
              The <strong>National Education Policy (NEP) 2020</strong> and{" "}
              <strong>NIPUN Bharat Mission</strong> have flagged this as a
              national priority.
            </p>
          </div>
          <div className="md:w-1/3">
            <Image
              src={crisisBgRemoved}
              alt="Crisis Illustration"
              width={500}
              height={500}
              className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Solution Content */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8 text-left">
          <div className="md:w-2/3">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#b7094c] mb-4">
              The Solution Within Reach
            </h3>
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
              Our EdTech solution turns math into a joyful, engaging experience
              — designed to help children build strong numeracy skills and
              confidence early on. By combining tactile learning with smart
              technology, we help kids stay curious and parents stay confident.
            </p>
          </div>
          <div className="md:w-1/3">
            <Image
              src={solution}
              alt="Solution"
              width={500}
              height={500}
              className="w-full max-w-sm mx-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CrisisSection;