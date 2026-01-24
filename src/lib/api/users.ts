import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { UserType } from "@/types/types";

export const getUsers = async () => {
  const response = await api.get<{ data: UserType[] }>("/users");
  return response.data.data;
};

export const getMyProfile = async () => {
  const response = await api.get<{ data: UserType }>("/users/me");
  return response.data.data;
};

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};

export const useMyProfileQuery = () => {
  const hasToken = !!localStorage.getItem("accessToken");
  
  return useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
    enabled: hasToken, // Only fetch if token exists
    retry: false, // Don't retry on 401
  });
};
