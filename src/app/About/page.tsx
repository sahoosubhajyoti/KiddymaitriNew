// app/about/page.tsx (for Next.js App Router)
// or src/pages/about.tsx (for Pages Router)

import React from "react";

const AboutUs: React.FC = () => {
  return (
    <div className="mt-20 min-h-[56vh] px-4 md:px-12 py-10 flex items-center justify-center">
      <div className="max-w-3xl text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">About Us</h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          <span className="font-semibold">Kiddymaitri Private Limited</span> deals with designing and
          manufacturing of learning-based games, puzzles, and toys.
          Additionally, it also offers a range of electronic toys tailored to
          enhance the learning experience for kids.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
