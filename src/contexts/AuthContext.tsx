import React, { createContext, useContext, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useMyProfileQuery } from "@/lib/api/users";
import { User, LoginInput, AuthTokenOutput, BaseGenericApiResponse } from "@/types/api";

export type UserRole = "disaster-manager" | "administrator" | "incident-validator" | "response-team" | string;

interface AuthContextType {
  user: User | null;
  login: (data: LoginInput) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  // Only fetch user if token exists
  const { data: user = null, isLoading, isError } = useMyProfileQuery();
  const hasToken = !!localStorage.getItem("accessToken");

  // If token exists but user failed to load, clear token
  if (hasToken && isError && !isLoading) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  const login = async (data: LoginInput) => {
    try {
      const response = await api.post<BaseGenericApiResponse<AuthTokenOutput>>("/auth/login", data);
      const { accessToken, refreshToken } = response.data.data;

      // Store tokens in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Refetch user data and invalidate other queries
      await queryClient.refetchQueries({ queryKey: ["profile"] });
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    // Clear storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Clear all queries
    queryClient.clear();

    // Redirect to login
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user && hasToken,
        isLoading: hasToken ? isLoading : false,
      }}
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
