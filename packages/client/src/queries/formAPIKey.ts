import { apiClient } from "../lib/apiClient";

export const getApiKey = async () => {
  const { data } = await apiClient.get("/api/formApiKey");
  return data;
};

export const generateApiKey = async () => {
  const { data } = await apiClient.post("/api/formApiKey/generate");
  return data;
};
