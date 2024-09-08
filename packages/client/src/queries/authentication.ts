import { apiClient } from "../lib/apiClient";
import { SignUpDataInterface } from "../types/User";

export const signUp = async (signUpData: SignUpDataInterface) => {
  const { data } = await apiClient.post("/api/user/auth/signup", signUpData);
  return data;
};

export const login = async (loginData: Omit<SignUpDataInterface, "name">) => {
  const { data } = await apiClient.post("/api/user/auth/login", loginData);
  return data;
};
