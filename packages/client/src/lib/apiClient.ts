import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import environments from "../environments";
import { getStoredAccessToken } from "../context/AuthContext.tsx";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export const apiClient = axios.create({
  baseURL: environments.VITE_SERVER_URL,
});

apiClient.interceptors.request.use((config) => {
  const submitly_token = getStoredAccessToken();
  if (submitly_token) {
    config.headers["Authorization"] = `Bearer ${submitly_token}`;
  }
  return config;
});
