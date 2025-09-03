"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/Authcontext";
import Link from "next/link";


export default function Login() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();
      console.log("data",data)

      if (res.ok) {
        console.log("Login successful:", data);
        console.log("Access token:", data.access);

        // Store token
        localStorage.setItem("token", data.access);

        // Store and set user in context
        const userData = { name: data.name, image: data.image, type:data.user_type };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        // Redirect to dashboard
        router.push("/Dashboard"); // Lowercase unless your folder is actually "Dashboard"
      } else {
        alert(data?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
          />
          <button type="submit" className="bg-green-600 text-white p-2 rounded">
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <Link href="/Signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
