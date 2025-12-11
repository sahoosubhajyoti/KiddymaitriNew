"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "../utility/axiosInstance"; // Adjust path as needed

interface User {
  name: string;
  image?: string;
  type?: string;
  language?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status
  const checkAuth = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setLoading(false);
      return;
    }
    try {
      // ✅ Updated to use axios
      const response = await api.get('/user');
      const userData = response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      const currentCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('MYNEXTAPP_LOCALE='))
    ?.split('=')[1];

  if (userData.language && userData.language !== currentCookie) {
     document.cookie = `MYNEXTAPP_LOCALE=${userData.language}; path=/; max-age=31536000; SameSite=Lax`;
     router.refresh();
  }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      // ✅ Updated to use axios
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear frontend state
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};