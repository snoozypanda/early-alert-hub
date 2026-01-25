import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
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

export const updateMyProfile = async (userId: number, data: { name?: string; email?: string; username?: string }) => {
  const response = await api.patch<{ data: UserType }>(`/users/${userId}`, data);
  return response.data.data;
};

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};

export const useMyProfileQuery = () => {
  const [hasToken, setHasToken] = useState(!!localStorage.getItem("accessToken"));

  useEffect(() => {
    // Check token immediately
    setHasToken(!!localStorage.getItem("accessToken"));

    // Also listen to custom event for token changes
    const handleTokenChange = () => {
      setHasToken(!!localStorage.getItem("accessToken"));
    };

    window.addEventListener("token-change", handleTokenChange);
    return () => window.removeEventListener("token-change", handleTokenChange);
  }, []);
  
  return useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
    enabled: hasToken, // Only fetch if token exists
    retry: false, // Don't retry on 401
  });
};

export const useUpdateMyProfileMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: { name?: string; email?: string; username?: string } }) => 
      updateMyProfile(userId, data),
    onSuccess: (data) => {
      // Update the cache with new profile data immediately
      queryClient.setQueryData(["profile"], data);
      
      // Invalidate and refetch the profile query to ensure UI is in sync with latest server data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
