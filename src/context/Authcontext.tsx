"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  name: string;
  image?: string;
  type?: string;
}
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
    loading: boolean;
    refreshToken: () => Promise<boolean>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Track initialization

  

// Function to refresh token
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Token refreshed successfully');
        return true;
      } else {
        console.log('Token refresh failed');
        await logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      return false;
    }
  };

  // Check authentication status
  const checkAuth = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else if (response.status === 401) {
        // Token expired, try to refresh
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // Retry getting user data after refresh
          const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/`, {
            credentials: 'include',
          });
          if (retryResponse.ok) {
            const userData = await retryResponse.json();
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            setUser(null);
            localStorage.removeItem("user");
          }
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } else {
        setUser(null);
        localStorage.removeItem("user");
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
      // Call backend logout
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout/`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear frontend state
      setUser(null);
      localStorage.removeItem("user");
    }
  };
  return (
    <AuthContext.Provider value={{ user, setUser, logout,loading,refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
