"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Renamed component to TestSignup
export default function TestSignup() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [otp, setOtp] = useState<string>("");
  const [resendTime, setResendTime] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendTime > 0) {
      const timer = setTimeout(() => setResendTime(resendTime - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTime]);

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return regex.test(email);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      // API call to register/send OTP
      // NOTE: You might want to point this to a different test user endpoint
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStep("otp");
        setCanResend(false);
        setResendTime(60);
      } else {
        const data = await res.json();
        setError(data?.message || "Signup failed. Try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setError("");
    setCanResend(false);
    setResendTime(60);

    try {
      // NOTE: You might want to point this to a different test user endpoint
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data?.message || "Failed to resend OTP. Try again.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("Failed to resend OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setIsSubmitting(true);

    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      setIsSubmitting(false);
      return;
    }

    try {
      // NOTE: You might want to point this to a different test user endpoint
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password,test_user: true }),
      });

      if (res.ok) {
        // Redirect to login after successful verification
        window.location.href = "/Login";
      } else {
        const data = await res.json();
        setError(data?.message || "OTP verification failed. Try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render OTP verification step
  if (step === "otp") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Verify OTP</h1>
          <p className="text-center mb-6">
            We&apos;ve sent a 6-digit code to <strong>{email}</strong>
          </p>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              required
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="border p-2 rounded text-center text-lg"
            />
            
            <button
              onClick={handleVerifyOtp}
              disabled={isSubmitting}
              className={`bg-blue-600 text-white p-2 rounded ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="text-center mt-4">
              <button
                onClick={handleResendOtp}
                disabled={!canResend}
                className={`text-blue-600 hover:underline ${
                  !canResend ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Resend OTP {!canResend && `(${resendTime}s)`}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </div>

          <p className="mt-6 text-sm text-center">
            Want to change email?{" "}
            <button 
              onClick={() => setStep("signup")}
              className="text-blue-600 hover:underline"
            >
              Go back
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Render signup form (default step)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      {/* Title changed for clarity */}
   
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Test User Sign Up</h1>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="password"
            required
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="password"
            required
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 text-white p-2 rounded ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Processing..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link href="/Login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}