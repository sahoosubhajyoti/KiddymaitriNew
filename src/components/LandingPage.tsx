import React from "react";

import HeroSection from "../components/HeroSection";
import CrisisSection from "../components/CrisisSection";
import ProductIntro from "../components/ProductIntro";
import Testimonials from "../components/Testimonials";
import NewsSection from "../components/NewsSection";
import Footer from "./Footer";
export default function LandingPage() {
  return (
    <div className="font-sans text-gray-800">
      <section id="home">
        <HeroSection />
      </section>

      <section id="crisis">
        <CrisisSection />
      </section>

      <section id="product">
        <ProductIntro />
      </section>

      <section id="testimonials">
        <Testimonials />
      </section>

      <section id="news">
        <NewsSection />
      </section>
      <Footer />
    </div>
  );
}