"use client";

import React from "react";

const NewsSection = () => {
  return (
    <section id="news" className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12 font-p">
        In the News
      </h2>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* YouTube */}
        <div className="w-full aspect-video">
          <iframe
            className="w-full h-full rounded-lg shadow-lg"
            src="https://www.youtube.com/embed/TgDJpgwOPcc"
            title="News Coverage"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* articles */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border-b-4 border-gray-400 rounded-lg p-4 shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300">
            <h4 className="text-2xl font-semibold text-gray-800 mb-2 font-poppins">
              Featured In PIB
            </h4>
            <p className="text-gray-600 mb-4">
              Handheld Device Design Challenge announced ahead of WAVES 2025.
            </p>
            <a
              href="https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2120522"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 font-medium hover:text-red-600 hover:underline"
            >
              Read Full Article →
            </a>
          </div>

          <div className="bg-white border-b-4 border-gray-400 rounded-lg p-4 shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300">
            <h4 className="text-2xl font-semibold text-gray-800 mb-2 font-poppins">
              Top 10 Finalists of Innovate2Educate
            </h4>
            <p className="text-gray-600 mb-2">
              KM Numeric was featured in a national article on educational
              innovation.
            </p>
            <a
              href="https://www.prokerala.com/news/articles/a1629389.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 font-medium hover:text-red-600 hover:underline"
            >
              Read Full Article →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;