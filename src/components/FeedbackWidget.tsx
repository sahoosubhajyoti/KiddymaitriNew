// components/FeedbackWidget.tsx
"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios"; // Import raw axios, NOT your custom instance

// Interface for the form state
interface FeedbackFormData {
  name: string;
  email: string;
  description: string;
}

// Interface for error messages
interface FormErrors {
  name?: string;
  email?: string;
  description?: string;
}

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState<FeedbackFormData>({
    name: "",
    email: "",
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // 1. Name Validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.length > 50) {
      newErrors.name = "Name must be 50 characters or less";
      isValid = false;
    }

    // 2. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // 3. Description Validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    } else {
      const wordCount = formData.description.trim().split(/\s+/).length;
      if (wordCount > 250) {
        newErrors.description = `Description limited to 250 words (currently ${wordCount})`;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        email: formData.email,
        name: formData.name,
        subject: "Website Feedback Widget", 
        review: 5, 
        body: formData.description 
      };

      // USE RAW AXIOS HERE
      // We explicitly avoid your custom 'api' instance to prevent auth redirects
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback/feedbacks/`, 
        payload
      );

      // Handle Success
      alert("Thank you for your feedback!");
      setFormData({ name: "", email: "", description: "" });
      setErrors({});
      setIsOpen(false);

    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden animate-fade-in-up">
          <div className="bg-gradient-to-r from-gray-900 to-pink-500 p-4">
            <h3 className="text-white font-bold text-lg">Send Feedback</h3>
            <p className="text-purple-100 text-sm">We'd love to hear from you!</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-xs text-gray-400">({formData.name.length}/50)</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                disabled={isSubmitting}
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-colors ${
                    errors.name 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:ring-purple-500"
                } disabled:bg-gray-100`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                disabled={isSubmitting}
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm transition-colors ${
                    errors.email
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:ring-purple-500"
                } disabled:bg-gray-100`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                disabled={isSubmitting}
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm resize-none transition-colors ${
                    errors.description
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:ring-purple-500"
                } disabled:bg-gray-100`}
                placeholder="Tell us what you think..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 shadow-md flex justify-center items-center ${
                isSubmitting 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-gray-900 to-pink-500 hover:from-purple-700 hover:to-pink-600"
              }`}
            >
              {isSubmitting ? "Sending..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      )}

      <button
        onClick={toggleOpen}
        className={`${
          isOpen 
            ? "bg-pink-600 hover:bg-pink-700" 
            : "bg-gradient-to-r from-gray-900 to-pink-500 hover:from-purple-700 hover:to-pink-600"
        } text-white p-4 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center justify-center`}
        aria-label="Toggle Feedback Form"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
}