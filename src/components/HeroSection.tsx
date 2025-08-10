"use client";

import React from "react";
import { motion } from "framer-motion";
import ParticlesBackground from "./ParticlesBackground";
import Tilt from "react-parallax-tilt";
import Image from "next/image";
import diagonal from "../assets/topography.svg";
import heroImage from "../assets/signal-2025-04-18-221311.png";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-bl to-[rgb(118,35,206)] from-[#f76f8e] px-6 text-white font-poppins overflow-hidden"
    >
      <Image
        src={diagonal}
        alt="bg-pattern"
        fill
        className="object-cover opacity-10 pointer-events-none z-0"
      />

      {/* ✨ Particles */}
      <div className="absolute inset-0 z-0">
        <ParticlesBackground />
      </div>

      <div className="md:w-1/2 z-10 relative px-4 text-center md:text-left">
        <motion.h1 
          className="text-2xl text-black/90 sm:text-3xl md:text-5xl mb-4 leading-tight font-poppins font-semibold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-3xl sm:text-4xl md:text-6xl text-white font-baloo">
            Empowering{" "}
          </span>
          Kids
          <br className="hidden md:block" />
          Through
          <span className="text-3xl sm:text-4xl md:text-6xl text-white font-baloo">
            {" "}
            Playful Learning
          </span>
        </motion.h1>

        <motion.p 
          className="text-sm sm:text-lg md:text-xl text-white mb-6 font-light max-w-md mx-auto md:mx-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Where curiosity meets creativity — shaping tomorrow's leaders through
          fun and purposeful learning.
        </motion.p>

        <motion.div 
          className="flex justify-center md:justify-start mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a
            href="#crisis" // Corrected anchor ID to match LandingPage component
            className="bg-white text-black text-base sm:text-lg hover:bg-gray-100 font-baloo font-semibold px-6 py-3 rounded-xl shadow transition"
          >
            Discover The Experience
          </a>
        </motion.div>
      </div>

      {/* 🖼️ Product image */}
      <motion.div
        className="md:w-1/2 z-10 mb-8 md:mb-0 flex justify-center items-center"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Tilt
          tiltMaxAngleX={10}
          tiltMaxAngleY={10}
          scale={1.2}
          className="w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg"
        >
          <Image
            src={heroImage}
            alt="Product"
            width={500}
            height={400}
            className="w-full h-[220px] sm:h-[280px] object-contain mx-auto"
            priority // Use priority for above-the-fold images
          />
        </Tilt>
      </motion.div>
    </section>
  );
};

export default HeroSection;