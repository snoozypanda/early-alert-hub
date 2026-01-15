import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserRole } from "@/lib/mockData";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string, role: UserRole) => {
    // Mock login - just set user based on role
    setUser({
      id: "1",
      name:
        role === "disaster-manager"
          ? "Dr. Abebe Kebede"
          : role === "incident-validator"
          ? "Agent Meron Tadesse"
          : role === "administrator"
          ? "Mr. Tesfaye Bekele"
          : "Response Team Member",

      email,
      role,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
