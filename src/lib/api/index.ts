import { z } from "zod";
import axios from "axios";

const VITE_API_URL = z.url();

export const apiURL =
  VITE_API_URL.parse(import.meta.env.VITE_API_URL) + "/api/v1";

export const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: apiURL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
    },
  });

  return instance;
};
