import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Flex } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createWebhook, updateWebhook } from "@/queries/webhook";
import { getErrorMessage } from "@/lib/error";
import { queryClient } from "@/lib/apiClient";
import { CREATE_WEBHOOK, GET_FORM_INFO, UPDATE_WEBHOOK } from "@/lib/constants";
import { WebhookType } from "@/types/Form";
import { Switch } from "@/components/ui/switch";

interface AddWebhookDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formId: string;
  mode: "add" | "edit";
  webhookInitialData?: WebhookType | null;
}

export default function AddWebhookDialog({
  isOpen,
  onOpenChange,
  formId,
  mode,
  webhookInitialData,
}: AddWebhookDialogProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<"GET" | "POST">("POST");
  const [secret, setSecret] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (webhookInitialData) {
      setTitle(webhookInitialData.title);
      setUrl(webhookInitialData.url);
      setMethod(webhookInitialData.method);
      setSecret(webhookInitialData.secret || "");
      setActive(webhookInitialData.active);
    }
  }, [webhookInitialData]);

  const { mutate: createWebhookMutation, isPending: isCreatingWebhook } =
    useMutation({
      mutationKey: [CREATE_WEBHOOK, formId],
      mutationFn: createWebhook,
      onSuccess: () => {
        toast.success("Webhook created successfully");
        onOpenChange(false);
        resetForm();
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: [GET_FORM_INFO, formId],
        });
      },
    });

  const { mutate: updateWebhookMutation, isPending: isUpdatingWebhook } =
    useMutation({
      mutationKey: [UPDATE_WEBHOOK, formId],
      mutationFn: updateWebhook,
      onSuccess: () => {
        toast.success("Webhook updated successfully");

        onOpenChange(false);
        resetForm();
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: [GET_FORM_INFO, formId],
        });
      },
    });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === "add") {
      if (!title || !url || !method) {
        return toast.error("Please fill all the fields");
      }
      createWebhookMutation({
        title,
        url,
        method,
        secret,
        formId,
        active,
      });
    } else {
      if (!title || !url || !method) {
        return toast.error("Please fill all the fields");
      }
      updateWebhookMutation({
        title,
        url,
        method,
        secret,
        active,
        webhookId: webhookInitialData?._id || "",
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setMethod("POST");
    setSecret("");
  };

  const isLoading = isCreatingWebhook || isUpdatingWebhook;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-neutral-900 border-neutral-800 text-neutral-200"
        aria-describedby="Add new webhook"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-neutral-200">
            {mode === "add" ? "Add New Webhook" : "Edit Webhook"}
          </DialogTitle>
        </DialogHeader>

        <Form.Root onSubmit={handleSubmit}>
          <Flex direction="column" gap="20px">
            <Form.Field name="title">
              <Form.Label className="text-sm font-medium text-neutral-200">
                Title
              </Form.Label>
              <Form.Control asChild>
                <input
                  type="text"
                  className="mt-1.5 w-full rounded-md bg-neutral-800 p-2.5 text-sm text-neutral-200 border border-neutral-700 focus:border-neutral-600 focus:outline-none"
                  placeholder="Enter webhook title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="url">
              <Form.Label className="text-sm font-medium text-neutral-200">
                URL
              </Form.Label>
              <Form.Control asChild>
                <input
                  type="url"
                  className="mt-1.5 w-full rounded-md bg-neutral-800 p-2.5 text-sm text-neutral-200 border border-neutral-700 focus:border-neutral-600 focus:outline-none"
                  placeholder="Enter webhook URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="method">
              <Form.Label className="text-sm font-medium text-neutral-200">
                Method
              </Form.Label>
              <Form.Control asChild>
                <select
                  className="mt-1.5 w-full rounded-md bg-neutral-800 p-2.5 text-sm text-neutral-200 border border-neutral-700 focus:border-neutral-600 focus:outline-none"
                  onChange={(e) => setMethod(e.target.value as "GET" | "POST")}
                  defaultValue={method}
                >
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                </select>
              </Form.Control>
            </Form.Field>

            <Form.Field name="secret">
              <Form.Label className="text-sm font-medium text-neutral-200">
                Secret (Optional)
              </Form.Label>
              <Form.Control asChild>
                <input
                  type="text"
                  className="mt-1.5 w-full rounded-md bg-neutral-800 p-2.5 text-sm text-neutral-200 border border-neutral-700 focus:border-neutral-600 focus:outline-none"
                  placeholder="Enter webhook secret"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="active" className="flex items-center gap-2">
              <Form.Label className="text-sm font-medium text-neutral-200">
                Active
              </Form.Label>
              <Form.Control asChild>
                <Switch
                  id="active"
                  checked={active}
                  onCheckedChange={setActive}
                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-red-600"
                />
              </Form.Control>
            </Form.Field>
          </Flex>

          <DialogFooter className="mt-6 sm:mt-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreatingWebhook}
              className="bg-neutral-800 text-neutral-200 border-neutral-700 hover:bg-neutral-700 transition-all duration-200"
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 text-neutral-200 hover:bg-green-700 transition-all duration-200"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "add" ? "Create Webhook" : "Update Webhook"}
            </Button>
          </DialogFooter>
        </Form.Root>
      </DialogContent>
    </Dialog>
  );
}
