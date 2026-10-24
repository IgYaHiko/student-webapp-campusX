"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "@/lib/api";

// Define the user shape based on your JWT payload
export interface User {
  sub: number;
  role: "student" | "staff" | "admin";
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // On mount, check if a token exists and decode it
  useEffect(() => {
    const initAuth = () => {
      const token = getToken();
      if (token) {
        try {
          // Decode the JWT payload (middle part of the token)
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUser({
            sub: payload.sub,
            role: payload.role,
            email: payload.email,
            name: payload.name,
          });
        } catch (e) {
          // Invalid token, clear it
          removeToken();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (token: string, userData: User) => {
    // Save token to local storage (done by the API client usually, but ensuring here)
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    removeToken();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the Auth Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}