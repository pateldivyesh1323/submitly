/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { handleError } from "../lib/error";
import { login, signUp } from "../queries/authentication";
import {
  AUTH_TOKEN_KEY,
  LOGIN_MUTATION_KEY,
  SIGN_UP_MUTATION_KEY,
} from "../lib/constants";
import { SignUpDataInterface } from "../types/User";
import { useNavigate } from "react-router-dom";

type PropsType = {
  children: ReactNode;
};

interface AuthContextType {
  signUpMutation: (data: SignUpDataInterface) => void;
  isSignUpLoading: boolean;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  loginMutation: (data: Omit<SignUpDataInterface, "name">) => void;
  isLoginLoading: boolean;
  logout: () => void;
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

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = getStoredAccessToken();

  useEffect(() => {
    setIsAuthLoading(true);
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsAuthLoading(false);
  }, [token]);

  const { mutate: signUpMutation, isPending: isSignUpLoading } = useMutation({
    mutationKey: [SIGN_UP_MUTATION_KEY],
    mutationFn: signUp,
    onError: (error) => {
      handleError(error);
    },
    onSuccess(data) {
      setStoredAccessToken(data.data.token);
      setIsAuthenticated(true);
      navigate("/dashboard");
    },
  });

  const { mutate: loginMutation, isPending: isLoginLoading } = useMutation({
    mutationKey: [LOGIN_MUTATION_KEY],
    mutationFn: login,
    onError: (error) => {
      handleError(error);
    },
    onSuccess(data) {
      setStoredAccessToken(data.data.token);
      setIsAuthenticated(true);
      navigate("/dashboard");
    },
  });

  const logout = () => {
    removeStoredAccessToken();
    setIsAuthenticated(false);
    navigate("/");
  };

  const value: AuthContextType = {
    signUpMutation,
    isSignUpLoading,
    loginMutation,
    isLoginLoading,
    isAuthLoading,
    isAuthenticated,
    logout,
  };

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
