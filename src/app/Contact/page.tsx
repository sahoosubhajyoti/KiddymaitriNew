"use client";

import Footer from "@/components/Footer";
import React, { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(formData);
  };

  return (
    <>
      <div className="mt-16 mb-4 px-4 min-h-[60vh]">
        {/* Centered Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-10">
          Contact Us
        </h2>

        {/* Contact Info and Form Section */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Address Section */}
          <div className="w-full md:w-1/2 text-gray-700 flex items-center flex-col justify-center text-base leading-relaxed md:min-h-[60vh]">
            <p className="mb-2 font-semibold text-lg">
              KIDDYMAITRI PRIVATE LIMITED
            </p>
            <p className="text-center">
              TI 109 AT FTBI, TIIR BUILDING NIT, ROURKELA,
              <br />
              Sundargarh, Odisha, India, 769008
            </p>
            {/* <p className="mt-2">GST No – 21AAJCK8733C1ZR</p> */}
          </div>

          {/* Contact Form */}
          <div className="w-full mr-24 md:w-1/2">
            <form
              onSubmit={handleSubmit}
              className="w-full bg-gray-100/60 shadow-md rounded-lg p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Your message for us"
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-500 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
