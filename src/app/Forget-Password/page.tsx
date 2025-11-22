"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();

  // Form States
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  
  // UI States
  const [step, setStep] = useState<"email" | "reset">("email"); // Controls which form is shown
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Timer States
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

  // --- STEP 1: SEND OTP ---
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStep("reset"); // Move to Step 2
        setCanResend(false);
        setResendTime(60);
        setSuccess("OTP sent successfully!");
      } else {
        const data = await res.json();
        setError(data?.message || "Failed to send OTP. Check the email.");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RESEND LOGIC ---
  const handleResendOtp = async () => {
    if (!canResend) return;

    setError("");
    setSuccess("");
    setCanResend(false);
    setResendTime(60);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSuccess("OTP resent successfully!");
      } else {
        const data = await res.json();
        setError(data?.message || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("Failed to resend OTP. Please try again.");
    }
  };

  // --- STEP 2: VERIFY OTP & RESET PASSWORD ---
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    // Validations
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      setIsSubmitting(false);
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsSubmitting(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Sending Email, OTP, and New Password together
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password: newPassword }),
      });

      if (res.ok) {
        setSuccess("Password reset successful! Redirecting...");
        // Optional: Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/Login");
        }, 2000);
      } else {
        const data = await res.json();
        setError(data?.message || "Failed to reset password. Invalid OTP?");
      }
    } catch (error) {
      console.error("Reset Password error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {step === "email" ? "Forgot Password" : "Reset Password"}
        </h1>

        {/* Success Message Banner */}
        {success && (
          <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded text-sm text-center">
            {success}
          </div>
        )}

        {step === "email" ? (
          // --- STEP 1 FORM: Email Only ---
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <p className="text-gray-600 text-center text-sm">
              Enter your email address and we will send you an OTP to reset your password.
            </p>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {isSubmitting ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          // --- STEP 2 FORM: OTP + New Password ---
          <div className="flex flex-col gap-4">
             <p className="text-center text-sm text-gray-600">
                Code sent to <strong>{email}</strong>
             </p>

             {/* Wrapper form to handle "Enter" key submission correctly */}
             <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                <input
                  type="text"
                  required
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="border p-2 rounded text-center text-lg tracking-widest"
                />

                <input
                  type="password"
                  required
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border p-2 rounded"
                />

                <input
                  type="password"
                  required
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border p-2 rounded"
                />

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-blue-600 text-white p-2 rounded ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? "Reset Password" : "Verify & Reset"}
                </button>
            </form>

            {/* Resend Logic */}
            <div className="text-center mt-2">
              <button
                onClick={handleResendOtp}
                disabled={!canResend}
                className={`text-blue-600 hover:underline text-sm ${
                  !canResend ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Resend OTP {!canResend && `(${resendTime}s)`}
              </button>
            </div>

            <p className="mt-4 text-sm text-center">
              Entered wrong email?{" "}
              <button 
                onClick={() => {
                    setStep("email");
                    setError("");
                    setSuccess("");
                }}
                className="text-blue-600 hover:underline"
              >
                Go back
              </button>
            </p>
          </div>
        )}

        <p className="mt-6 text-sm text-center">
          Remember your password?{" "}
          <Link href="/Login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}