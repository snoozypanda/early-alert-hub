import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { LoginUserType } from "@/types/types";
import { BaseGenericApiResponse, AuthTokenOutput } from "@/types/api";

const loginUserFunc = async (loginUser: LoginUserType) => {
  const response = await api.post<BaseGenericApiResponse<AuthTokenOutput>>("/auth/login", loginUser);
  return response.data;
};

export const useLoginUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUserFunc,
    onSuccess: (responseData) => {
      const { accessToken, refreshToken } = responseData.data;
      
      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      
      // Dispatch custom event to notify hooks of token change
      window.dispatchEvent(new Event("token-change"));
      
      // Invalidate profile query so it gets refetched with new token
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
