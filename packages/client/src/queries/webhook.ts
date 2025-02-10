import { apiClient } from "@/lib/apiClient";

type CreateWebhookProps = {
  title: string;
  url: string;
  method: "GET" | "POST";
  secret: string;
  formId: string;
  active: boolean;
};

const createWebhook = async (webhook: CreateWebhookProps) => {
  const { data } = await apiClient.post("/api/form/webhooks", webhook);
  return data;
};

const updateWebhook = async (
  webhook: Omit<CreateWebhookProps, "formId"> & { webhookId: string },
) => {
  const { data } = await apiClient.put("/api/form/webhooks", webhook);
  return data;
};

const deleteWebhook = async (webhookId: string) => {
  const { data } = await apiClient.delete("/api/form/webhooks", {
    data: { webhookId },
  });
  return data;
};

export { createWebhook, updateWebhook, deleteWebhook };
