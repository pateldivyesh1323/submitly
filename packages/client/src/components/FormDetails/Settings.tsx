import * as Dialog from "@radix-ui/react-dialog";
import {
  CopyIcon,
  Cross2Icon,
  PlusCircledIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  Code,
  Flex,
  IconButton,
  Skeleton,
  Switch,
  Text,
} from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import {
  DELETE_FORM,
  DELETE_WEBHOOK,
  GET_FORM_INFO,
  TOGGLE_FORM_ACTIVATION,
  UPDATE_FORM_EMAIL,
} from "../../lib/constants";
import {
  deleteForm,
  downloadFormSubmissionsCSV,
  getFormInfo,
  toggleFormActivation,
} from "../../queries/form";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getErrorMessage } from "../../lib/error";
import { queryClient } from "../../lib/apiClient";
import {
  Settings as SettingsIcon,
  Link as LinkIcon,
  Mail as MailIcon,
  Download,
} from "lucide-react";
import AddWebhookDialog from "./Webhook/AddWebhookDialog";
import { WebhookType } from "@/types/Form";
import { Badge } from "@/components/ui/badge";
import { deleteWebhook } from "@/queries/webhook";
import { updateFormEmail } from "@/queries/formEmail";
import AddEmailDialog from "./FormEmail/AddEmailDialog";

export default function Settings() {
  const params = useParams();
  const navigate = useNavigate();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isWebhookDrawerOpen, setIsWebhookDrawerOpen] = useState(false);
  const [webhookMode, setWebhookMode] = useState<"add" | "edit">("add");
  const [webhookInitialData, setWebhookInitialData] =
    useState<WebhookType | null>(null);
  const [emails, setEmails] = useState<
    {
      address: string;
      active: boolean;
    }[]
  >([]);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailMode, setEmailMode] = useState<"add" | "edit">("add");
  const [emailInitialData, setEmailInitialData] = useState<{
    address: string;
    active: boolean;
  } | null>(null);

  const { data: formInfoData, isLoading: formInfoLoading } = useQuery({
    queryKey: [GET_FORM_INFO, params.id],
    queryFn: () => getFormInfo(params.id || ""),
  });

  const { mutate: deleteMutation } = useMutation({
    mutationKey: [DELETE_FORM, params.id],
    mutationFn: () => deleteForm(params.id || ""),
    onSuccess: () => {
      toast.success("Form deleted successfully");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const { mutate: toggleFormActivationMutation } = useMutation({
    mutationKey: [TOGGLE_FORM_ACTIVATION, params.id],
    mutationFn: () => toggleFormActivation(params.id || ""),
    onSuccess: (data) => {
      toast.success(data?.message || "Updated successfully");
      queryClient.invalidateQueries({
        queryKey: [GET_FORM_INFO, params.id],
        exact: true,
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const { mutate: deleteWebhookMutation } = useMutation({
    mutationKey: [DELETE_WEBHOOK, params.id],
    mutationFn: (webhookId: string) => deleteWebhook(webhookId),
    onSuccess: () => {
      toast.success("Webhook deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [GET_FORM_INFO, params.id],
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const { mutate: updateEmailMutation } = useMutation({
    mutationKey: [UPDATE_FORM_EMAIL, params.id],
    mutationFn: () => updateFormEmail(params.id || "", emails),
    onSuccess: () => {
      toast.success("Emails updated successfully");
      queryClient.invalidateQueries({
        queryKey: [GET_FORM_INFO, params.id],
        exact: true,
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleToggleMutation = () => {
    toggleFormActivationMutation();
  };

  const handleFormIdCopy = () => {
    navigator.clipboard.writeText(params.id || "");
    toast.success("Form ID copied to clipboard");
  };

  const handleFormDelete = () => {
    deleteMutation();
    setIsFormOpen(false);
  };

  const handleDeleteWebhook = (id: string) => {
    deleteWebhookMutation(id);
  };

  const handleEmailUpdate = () => {
    updateEmailMutation();
  };

  useEffect(() => {
    if (isWebhookDrawerOpen === false) {
      setWebhookInitialData(null);
      setWebhookMode("add");
    }
  }, [isWebhookDrawerOpen]);

  useEffect(() => {
    if (formInfoData?.data?.email) {
      setEmails(formInfoData?.data?.email || []);
    }
  }, [formInfoData]);

  const webhooks: WebhookType[] = formInfoData?.data?.webhook || [];

  return (
    <Flex direction="column" gap="6" className="w-full max-w-3xl mx-auto p-6">
      <Flex
        direction="column"
        gap="3"
        className="p-4 border border-neutral-800 rounded-sm shadow-xs bg-neutral-900"
      >
        <Text
          size="2"
          weight="bold"
          className="text-neutral-200 mb-2 flex items-center gap-2"
        >
          <SettingsIcon className="w-4 h-4" />
          General Settings
        </Text>
        <Flex direction="row" align="center" justify="between">
          <Text size="2" weight="bold" className="text-neutral-200">
            Form ID
          </Text>
          <Flex align="center" gap="2">
            <Code variant="ghost" className="text-neutral-200">
              {params.id}
            </Code>
            <IconButton
              size="1"
              aria-label="Copy Form ID"
              color="gray"
              variant="ghost"
              onClick={handleFormIdCopy}
            >
              <CopyIcon />
            </IconButton>
          </Flex>
        </Flex>

        <Flex direction="row" align="center" justify="between">
          <Text size="2" weight="bold" className="text-neutral-200">
            Form Name
          </Text>
          <Text className="text-neutral-200">
            {formInfoLoading ? (
              <Skeleton width="120px">Loading...</Skeleton>
            ) : (
              formInfoData.data.name
            )}
          </Text>
        </Flex>

        <Flex direction="row" align="center" justify="between">
          <Text size="2" weight="bold" className="text-neutral-200">
            Created At
          </Text>
          <Text className="text-neutral-200">
            {formInfoLoading ? (
              <Skeleton width="140px">Loading...</Skeleton>
            ) : (
              new Date(formInfoData.data.createdAt).toLocaleString()
            )}
          </Text>
        </Flex>

        <Flex direction="row" align="center" justify="between">
          <Text size="2" weight="bold" className="text-neutral-200">
            Active
          </Text>
          {formInfoLoading ? (
            <Skeleton width="40px">
              <Switch defaultChecked />
            </Skeleton>
          ) : (
            <Switch
              defaultChecked={formInfoData.data.active}
              className="cursor-pointer"
              onClick={handleToggleMutation}
            />
          )}
        </Flex>
      </Flex>

      <div className="p-4 border border-neutral-800 rounded-sm shadow-xs bg-neutral-900">
        <Text
          size="2"
          weight="bold"
          className="text-neutral-200 mb-3 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Data
        </Text>
        <Text className="text-neutral-400 mb-4">
          Download all form submissions as a CSV file.
        </Text>
        <Button
          variant="outline"
          onClick={() => downloadFormSubmissionsCSV(params.id || "")}
          className="flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          Download CSV
        </Button>
      </div>

      <div className="p-4 border border-neutral-800 rounded-sm shadow-xs bg-neutral-900">
        <Text
          size="2"
          weight="bold"
          className="text-neutral-200 mb-3 flex items-center gap-2"
        >
          <MailIcon className="w-4 h-4" />
          Email Settings
        </Text>

        {emails.length > 0 ? (
          emails.map((email, index) => (
            <Flex
              key={index}
              align="center"
              justify="between"
              className="border-b border-neutral-800 last:border-b-0 py-2"
            >
              <Code
                variant="ghost"
                className="text-neutral-200 flex items-center gap-2"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    email.active ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {email.address}
              </Code>
              <Flex gap="2">
                <IconButton
                  aria-label="Edit Email"
                  onClick={() => {
                    setEmailMode("edit");
                    setEmailInitialData(email);
                    setIsEmailDialogOpen(true);
                  }}
                >
                  <Pencil1Icon />
                </IconButton>
                <IconButton
                  aria-label="Delete Email"
                  onClick={() => {
                    const newEmails = [...emails];
                    newEmails.splice(index, 1);
                    setEmails(newEmails);
                    handleEmailUpdate();
                  }}
                >
                  <TrashIcon />
                </IconButton>
              </Flex>
            </Flex>
          ))
        ) : (
          <Text className="text-neutral-200 text-sm">
            No email notifications configured.
          </Text>
        )}
        <Flex className="mt-3">
          <Button
            variant="outline"
            onClick={() => {
              setEmailMode("add");
              setEmailInitialData(null);
              setIsEmailDialogOpen(true);
            }}
          >
            <PlusCircledIcon />
            Add Email
          </Button>
        </Flex>
      </div>

      {/* Webhooks Section */}
      <div className="p-4 border border-neutral-800 rounded-sm shadow-xs bg-neutral-900">
        <Text
          size="2"
          weight="bold"
          className="text-neutral-200 mb-3 flex items-center gap-2"
        >
          <LinkIcon className="w-4 h-4" />
          Webhook Settings
        </Text>

        {webhooks.length > 0 ? (
          webhooks.map((wh) => (
            <Flex
              key={wh._id}
              align="center"
              justify="between"
              className="border-b border-neutral-800 last:border-b-0 py-2"
            >
              <Code
                variant="ghost"
                className="text-neutral-200 flex items-center gap-2"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    wh.active ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {wh.title} - {wh.url} <Badge>{wh.method}</Badge>
              </Code>
              <Flex gap="2">
                <IconButton
                  aria-label="Edit Webhook"
                  onClick={() => {
                    setWebhookMode("edit");
                    setWebhookInitialData(wh);
                    setIsWebhookDrawerOpen(true);
                  }}
                >
                  <Pencil1Icon />
                </IconButton>

                <IconButton
                  aria-label="Delete Webhook"
                  onClick={() => handleDeleteWebhook(wh._id)}
                >
                  <TrashIcon />
                </IconButton>
              </Flex>
            </Flex>
          ))
        ) : (
          <Text className="text-neutral-200 text-sm">
            No webhooks configured.
          </Text>
        )}
        <Flex className="mt-3">
          <Button
            variant="outline"
            onClick={() => {
              setWebhookMode("add");
              setWebhookInitialData(null);
              setIsWebhookDrawerOpen(true);
            }}
          >
            <PlusCircledIcon />
            Add Webhook
          </Button>
        </Flex>
      </div>
      <div className="p-4 border border-red-800 rounded-md bg-neutral-900 flex flex-col gap-2">
        <Text size="4" weight="bold" className="text-red-400">
          Danger Zone
        </Text>
        <Text className="text-neutral-400 mb-4">
          Once you delete a form, there is no going back. Please be certain.
        </Text>
        <Dialog.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
          <Dialog.Trigger asChild>
            <Button
              color="red"
              variant="destructive"
              className="cursor-pointer w-fit"
            >
              Delete this form
            </Button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
            <Dialog.Content className="fixed top-[50%] left-[50%] w-[90vw] max-w-md transform -translate-x-1/2 -translate-y-1/2 bg-neutral-900 p-6 rounded-lg shadow-lg border border-neutral-800">
              <Dialog.Title className="text-lg font-bold text-neutral-200">
                Confirm Delete
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-neutral-400">
                Are you sure you want to delete this form? This action cannot be
                undone.
              </Dialog.Description>
              <div className="mt-4 flex justify-end space-x-4">
                <Dialog.Close asChild>
                  <Button
                    variant="outline"
                    className="bg-neutral-800 hover:bg-neutral-700 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button
                  color="red"
                  variant="destructive"
                  onClick={handleFormDelete}
                  className="hover:bg-red-600 transition-all duration-200"
                >
                  Delete Form
                </Button>
              </div>
              <Dialog.Close asChild>
                <button className="absolute top-2.5 right-2.5 text-neutral-400 hover:text-neutral-300">
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <AddWebhookDialog
        isOpen={isWebhookDrawerOpen}
        onOpenChange={setIsWebhookDrawerOpen}
        formId={formInfoData?.data?.formId || ""}
        mode={webhookMode}
        webhookInitialData={webhookInitialData}
      />
      <AddEmailDialog
        isOpen={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
        mode={emailMode}
        emailInitialData={emailInitialData}
        isLoading={false}
        onSubmit={(emailData) => {
          if (emailMode === "add") {
            setEmails([...emails, emailData]);
          } else {
            const newEmails = [...emails];
            const index = newEmails.findIndex(
              (e) => e.address === emailInitialData?.address,
            );
            if (index !== -1) {
              newEmails[index] = emailData;
              setEmails(newEmails);
            }
          }
          handleEmailUpdate();
          setIsEmailDialogOpen(false);
        }}
      />
    </Flex>
  );
}
