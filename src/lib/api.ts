import axios from "axios";
import { z } from "zod";

const VITE_API_URL = z.url();
const API_BASE_URL =
  VITE_API_URL.parse(import.meta.env.VITE_API_URL) + "/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

interface FailedRequest extends Error {
  config: any;
}

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    // Unwrapp response data if it follows { meta, data } structure
    // but we usually want the full response or just data?
    // The user requirement said "All success responses: { meta: {}, data: T }"
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          // No refresh token, logout
          throw new Error("No refresh token");
        }

        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {
            refreshToken,
          },
        );

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token invalid or expired
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
