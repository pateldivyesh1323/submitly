import { apiClient } from "../lib/apiClient";

export const getForms = async () => {
  const { data } = await apiClient.get("/api/form/all");
  return data;
};
