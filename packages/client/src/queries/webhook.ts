import { apiClient } from "@/lib/apiClient";

type CreateWebhookProps = {
  title: string;
  url: string;
  method: "GET" | "POST";
  secret: string;
  formId: string;
};

const createWebhook = async (webhook: CreateWebhookProps) => {
  const { data } = await apiClient.post("/api/form/webhooks", webhook);
  return data;
};

export default createWebhook;
