import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { apiURL } from "./index";
import { LoginUserType } from "@/types/types";

const loginUserFunc = async (loginUser: LoginUserType) => {
  const response = await axios.post(`${apiURL}/auth/login`, loginUser);
  return response.data;
};

export const useLoginUserMutation = () => {
  return useMutation({
    mutationFn: loginUserFunc,
    onSuccess: (responseData) => {
      localStorage.setItem("accessToken", responseData.data.accessToken);
      localStorage.setItem("refreshToken", responseData.data.refreshToken);
    },
  });
};
