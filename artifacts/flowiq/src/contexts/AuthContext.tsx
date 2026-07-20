import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  departmentId: number | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "").replace(/\/[^/]+$/, "");

  export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>({
      id: 1,
      name: "Demo User",
      email: "demo@flowiq.com",
      role: "admin",
      departmentId: null,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setLoading(false);
    }, []);
    const login = useCallback(async () => {
      setUser({
        id: 1,
        name: "Demo User",
        email: "demo@flowiq.com",
        role: "admin",
        departmentId: null,
      });
    }, []);
    
    const logout = useCallback(async () => {
      setUser(null);
    }, []);
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
