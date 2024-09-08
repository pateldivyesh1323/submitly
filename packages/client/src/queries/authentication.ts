import { apiClient } from "../lib/apiClient";
import { SignUpDataInterface } from "../types/User";

export const signUp = async (signUpData: SignUpDataInterface) => {
  const { data } = await apiClient.post("/api/user/auth/signup", signUpData);
  return data;
};
