import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { apiURL } from "./index";
import type { NewUserType } from "@/types/types";

const registerUserFunc = async (newUser: NewUserType) => {
  const response = await axios.post(`${apiURL}/auth/register`, newUser);
  return response.data;
};

export const useRegisterUserMutation = () => {
  return useMutation({
    mutationFn: registerUserFunc,
    onSuccess: (responseData) => {
      localStorage.setItem("accessToken", responseData.data.accessToken);
      localStorage.setItem("refreshToken", responseData.data.refreshToken);
    },
  });
};
