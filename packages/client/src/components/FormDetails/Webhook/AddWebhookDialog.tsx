import { useState } from "react";
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

import createWebhook from "@/queries/webhook";
import { getErrorMessage } from "@/lib/error";
import { queryClient } from "@/lib/apiClient";
import { GET_FORM_INFO } from "@/lib/constants";

interface AddWebhookDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formId: string;
}

export default function AddWebhookDialog({
  isOpen,
  onOpenChange,
  formId,
}: AddWebhookDialogProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<"GET" | "POST">("POST");
  const [secret, setSecret] = useState("");

  const { mutate: createWebhookMutation, isPending: isCreatingWebhook } =
    useMutation({
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

  const handleCreateWebhook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !url || !method) {
      return toast.error("Please fill all the fields");
    }
    createWebhookMutation({
      title,
      url,
      method,
      secret,
      formId,
    });
  };

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setMethod("POST");
    setSecret("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-neutral-900 border-neutral-800 text-neutral-200"
        aria-describedby="Add new webhook"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-neutral-200">
            Add New Webhook
          </DialogTitle>
        </DialogHeader>

        <Form.Root onSubmit={handleCreateWebhook}>
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
                  defaultValue="POST"
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
          </Flex>

          <DialogFooter className="mt-6 sm:mt-6">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreatingWebhook}
              className="bg-neutral-800 text-neutral-200 border-neutral-700 hover:bg-neutral-700 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreatingWebhook}
              className="bg-green-600 text-neutral-200 hover:bg-green-700 transition-all duration-200"
            >
              {isCreatingWebhook && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Webhook
            </Button>
          </DialogFooter>
        </Form.Root>
      </DialogContent>
    </Dialog>
  );
}
