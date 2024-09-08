/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { handleError } from "../lib/error";
import { signUp } from "../queries/authentication";
import { AUTH_TOKEN_KEY, SIGN_UP_MUTATION_KEY } from "../lib/constants";
import { SignUpDataInterface } from "../types/User";
import { useNavigate } from "react-router-dom";

type PropsType = {
  children: ReactNode;
};

interface AuthContextType {
  signUpMutation: (data: SignUpDataInterface) => void;
  isSignUpLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const getStoredAccessToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

const setStoredAccessToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

const removeStoredAccessToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const AuthProvider = ({ children }: PropsType) => {
  const navigate = useNavigate();

  const { mutate: signUpMutation, isPending: isSignUpLoading } = useMutation({
    mutationKey: [SIGN_UP_MUTATION_KEY],
    mutationFn: signUp,
    onError: (error) => {
      handleError(error);
    },
    onSuccess(data) {
      setStoredAccessToken(data.data.token);
      navigate("/dashboard");
    },
  });

  const value: AuthContextType = { signUpMutation, isSignUpLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { getStoredAccessToken, setStoredAccessToken, removeStoredAccessToken };
