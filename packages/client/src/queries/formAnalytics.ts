import { apiClient } from "../lib/apiClient";

export const getFormAnalytics = async (id: string) => {
  const { data } = await apiClient.get(`/api/form/analytics/${id}`);
  return data;
};
