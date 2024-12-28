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
  keyword = "" as string,
) => {
  keyword = encodeURIComponent(keyword);
  const { data } = await apiClient.get(
    `/form/submit/${formId}?page=${page}&sort=${sortBy}&keyword=${keyword}`,
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

export const deleteFormSubmissions = async (
  formId: string,
  submissionIds: string[],
) => {
  if (submissionIds.length === 0) {
    return;
  }
  const { data } = await apiClient.delete(`/form/submit/delete/${formId}`, {
    data: { submissionIds },
  });
  return data;
};
