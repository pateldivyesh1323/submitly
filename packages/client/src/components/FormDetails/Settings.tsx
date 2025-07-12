import {
  CopyIcon,
  PlusCircledIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

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

  const { mutate: toggleFormActivationMutation, isPending: isTogglePending } =
    useMutation({
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
    <div className="w-full max-w-3xl mx-auto p-6 flex flex-col gap-6">
      <div className="p-4 border border-neutral-800 rounded-sm shadow-xs bg-neutral-900 flex flex-col gap-3">
        <p className="text-sm font-bold text-neutral-200 mb-2 flex items-center gap-2">
          <SettingsIcon className="w-4 h-4" />
          General Settings
        </p>
        <div className="flex flex-row items-center justify-between">
          <p className="text-sm font-bold text-neutral-200">Form ID</p>
          <div className="flex items-center gap-2">
            <code className="text-neutral-200 bg-neutral-700 p-1 rounded-md text-xs">
              {params.id}
            </code>
            <Button
              size="icon"
              aria-label="Copy Form ID"
              variant="ghost"
              onClick={handleFormIdCopy}
              className="h-6 w-6"
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between">
          <p className="text-sm font-bold text-neutral-200">Form Name</p>
          <p className="text-neutral-200 text-sm">
            {formInfoLoading ? (
              <Skeleton className="h-4 w-[120px]" />
            ) : (
              formInfoData.data.name
            )}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between">
          <p className="text-sm font-bold text-neutral-200">Created At</p>
          <p className="text-neutral-200 text-sm">
            {formInfoLoading ? (
              <Skeleton className="h-4 w-[140px]" />
            ) : (
              new Date(formInfoData.data.createdAt).toLocaleString()
            )}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between">
          <p className="text-sm font-bold text-neutral-200">Active</p>
          {formInfoLoading ? (
            <Skeleton className="h-6 w-11 rounded-full" />
          ) : (
            <Switch
              checked={formInfoData.data.active}
              onCheckedChange={handleToggleMutation}
              disabled={isTogglePending}
            />
          )}
        </div>
      </div>

      <div className="p-4 border border-neutral-800 rounded-sm shadow-xs bg-neutral-900">
        <p className="text-sm font-bold text-neutral-200 mb-3 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </p>
        <p className="text-neutral-400 mb-4 text-sm">
          Download all form submissions as a CSV file.
        </p>
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
        <p className="text-sm font-bold text-neutral-200 mb-3 flex items-center gap-2">
          <MailIcon className="w-4 h-4" />
          Email Settings
        </p>

        {emails.length > 0 ? (
          emails.map((email, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-neutral-800 last:border-b-0 py-2"
            >
              <code className="text-neutral-200 flex items-center gap-2 text-sm">
                <div
                  className={`w-2 h-2 rounded-full ${
                    email.active ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {email.address}
              </code>
              <div className="flex gap-2">
                <Button
                  aria-label="Edit Email"
                  onClick={() => {
                    setEmailMode("edit");
                    setEmailInitialData(email);
                    setIsEmailDialogOpen(true);
                  }}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Pencil1Icon />
                </Button>
                <Button
                  aria-label="Delete Email"
                  onClick={() => {
                    const newEmails = [...emails];
                    newEmails.splice(index, 1);
                    setEmails(newEmails);
                    handleEmailUpdate();
                  }}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <TrashIcon />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-neutral-200 text-sm">
            No email notifications configured.
          </p>
        )}
        <div className="mt-3 flex">
          <Button
            variant="outline"
            onClick={() => {
              setEmailMode("add");
              setEmailInitialData(null);
              setIsEmailDialogOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <PlusCircledIcon />
            Add Email
          </Button>
        </div>
      </div>

      {/* Webhooks Section */}
      <div className="p-4 border border-neutral-800 rounded-sm shadow-xs bg-neutral-900">
        <p className="text-sm font-bold text-neutral-200 mb-3 flex items-center gap-2">
          <LinkIcon className="w-4 h-4" />
          Webhook Settings
        </p>

        {webhooks.length > 0 ? (
          webhooks.map((wh) => (
            <div
              key={wh._id}
              className="flex items-center justify-between border-b border-neutral-800 last:border-b-0 py-2"
            >
              <code className="text-neutral-200 flex items-center gap-2 text-sm">
                <div
                  className={`w-2 h-2 rounded-full ${
                    wh.active ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {wh.title} - {wh.url} <Badge>{wh.method}</Badge>
              </code>
              <div className="flex gap-2">
                <Button
                  aria-label="Edit Webhook"
                  onClick={() => {
                    setWebhookMode("edit");
                    setWebhookInitialData(wh);
                    setIsWebhookDrawerOpen(true);
                  }}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Pencil1Icon />
                </Button>

                <Button
                  aria-label="Delete Webhook"
                  onClick={() => handleDeleteWebhook(wh._id)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <TrashIcon />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-neutral-200 text-sm">No webhooks configured.</p>
        )}
        <div className="mt-3 flex">
          <Button
            variant="outline"
            onClick={() => {
              setWebhookMode("add");
              setWebhookInitialData(null);
              setIsWebhookDrawerOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <PlusCircledIcon />
            Add Webhook
          </Button>
        </div>
      </div>
      <div className="p-4 border border-red-800 rounded-md bg-neutral-900 flex flex-col gap-2">
        <p className="text-lg font-bold text-red-400">Danger Zone</p>
        <p className="text-neutral-400 mb-4 text-sm">
          Once you delete a form, there is no going back. Please be certain.
        </p>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="cursor-pointer w-fit">
              Delete this form
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this form? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:justify-end">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-neutral-800 hover:bg-neutral-700 transition-all duration-200"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                variant="destructive"
                onClick={handleFormDelete}
                className="hover:bg-red-600 transition-all duration-200"
              >
                Delete Form
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
    </div>
  );
}
