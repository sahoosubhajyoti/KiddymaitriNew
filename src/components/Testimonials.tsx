"use client";

import React, { useEffect, useRef, useState } from "react";

// Define TypeScript types for your data
interface TestimonialData {
  name: string;
  comment: string;
}

const data: TestimonialData[] = [
  {
    name: "A parent",
    comment:
      "The device is entertaining for the children and help in educational activities",
  },
  {
    name: "A teacher.",
    comment:
      "To me it is effective for the children. The device fulfils both concentration and learning among the children",
  },
  {
    name: "A student",
    comment:
      "I am an Odia medium student. The game is interesting. It is very good.",
  },
];

const Testimonials = () => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null); // Use useRef with a type

  // Duplicate data for a smooth loop (we'll render it twice for a continuous effect)
  const testimonials = [...data, ...data];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationFrame: number;
    const scrollSpeed = 1;
    
    // We only need to duplicate the data once to handle the loop
    const totalScrollWidth = container.scrollWidth / 2;

    const smoothScroll = () => {
      if (!isPaused && container) {
        container.scrollLeft += scrollSpeed;
        
        // Reset scroll position to create a seamless loop
        if (container.scrollLeft >= totalScrollWidth) {
          container.scrollLeft = 0;
        }
      }
      animationFrame = requestAnimationFrame(smoothScroll);
    };

    animationFrame = requestAnimationFrame(smoothScroll);

    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused]);

  // Touch and hover control
  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  return (
    <section
      className="bg-pink-50 py-16 px-4 overflow-hidden"
      id="testimonials"
    >
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 font-poppins">
        What Parents Say
      </h2>

      <div className="relative w-full max-w-6xl mx-auto">
        <div
          ref={scrollRef}
          className="flex mb-10 gap-4 overflow-x-hidden pb-4"
          onMouseEnter={handlePause}
          onMouseLeave={handleResume}
          onTouchStart={handlePause}
          onTouchEnd={handleResume}
        >
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="flex-shrink-0 bg-white rounded-xl shadow-lg p-6 w-72 sm:w-80 h-48 flex flex-col justify-center items-center transform transition-transform duration-300 hover:scale-105 cursor-pointer select-none"
            >
              <div className="text-5xl mb-3 text-black">❝</div>
              <p className="text-gray-700 text-center text-sm leading-relaxed mb-4 flex-grow flex items-center">
                {t.comment}
              </p>
              <div className="border-t border-gray-200 pt-3 w-full text-center">
                <p className="text-red-600 font-semibold text-sm">— {t.name}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold font-poppins text-center mb-8 text-gray-800">
            Our Achievements
          </h2>
          <div className="flex items-center justify-center">
            <a
              href="https://www.linkedin.com/posts/gamingsociety_innovate2educate-createinindiachallenge-videogamechallenge-activity-7325046062413455360-neAS/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="relative bg-white rounded-lg shadow-md p-6 transform transition-transform duration-300 hover:scale-104 cursor-pointer">
                <h3 className="text-2xl text-center font-semibold text-red-600 mb-4">
                  🏆 First Prize Innovate2Educate
                </h3>
                <p className="text-gray-800 text-lg">
                  Awarded for our innovation in foundational numeracy at WAVES
                  2025.
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;