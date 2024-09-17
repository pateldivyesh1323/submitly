import { apiClient } from "../lib/apiClient";

export const getForms = async () => {
  const { data } = await apiClient.get("/api/form/all");
  return data;
};

export const createForm = async (formName: string) => {
  const { data } = await apiClient.post("/api/form", { name: formName });
  return data;
};
