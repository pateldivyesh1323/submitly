import { apiClient } from "../lib/apiClient";

export const getForms = async () => {
  const { data } = await apiClient.get("/api/form/all");
  return data;
};

export const createForm = async (formName: string) => {
  const { data } = await apiClient.post("/api/form", { name: formName });
  return data;
};

export const getFormInfo = async (formId: string) => {
  const { data } = await apiClient.get(`/api/form/${formId}`);
  return data;
};

export const getFormSubmissions = async (
  formId: string,
  page = "1" as string,
  sortBy = "latest" as string,
) => {
  const { data } = await apiClient.get(
    `/form/submit/${formId}?page=${page}&sort=${sortBy}`,
  );
  return data;
};

export const deleteForm = async (formId: string) => {
  await apiClient.delete(`/api/form/${formId}`);
};

export const toggleFormActivation = async (formId: string) => {
  const { data } = await apiClient.put(`/api/form/${formId}/toggleactivation`);
  return data;
};
