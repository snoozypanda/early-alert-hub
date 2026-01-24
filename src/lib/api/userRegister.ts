import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { apiURL } from "./index";
import type { newUserType } from "@/types/types";

const registerUserFunc = async (newUser: newUserType) => {
  const response = await axios.post(`${apiURL}/auth/register`, newUser);
  return response.data;
};

export const useRegisterUserMutation = () => {
  return useMutation({ mutationFn: registerUserFunc });
};
