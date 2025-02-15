import { apiClient } from "@/lib/apiClient";

const updateFormEmail = async (
  formId: string,
  email: {
    address: string;
    active: boolean;
  }[],
) => {
  const { data } = await apiClient.post(`/api/form/emails`, {
    formId,
    email,
  });
  return data;
};

export { updateFormEmail };
