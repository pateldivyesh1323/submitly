import * as Dialog from "@radix-ui/react-dialog";
import { CopyIcon, Cross2Icon } from "@radix-ui/react-icons";
import {
  Button,
  Code,
  DataList,
  Flex,
  IconButton,
  Skeleton,
  Switch,
} from "@radix-ui/themes";
import {
  DELETE_FORM,
  GET_FORM_INFO,
  TOGGLE_FORM_ACTIVATION,
} from "../../lib/constants";
import {
  deleteForm,
  getFormInfo,
  toggleFormActivation,
} from "../../queries/form";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { getErrorMessage } from "../../lib/error";
import { queryClient } from "../../lib/apiClient";

export default function Details() {
  const params = useParams();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  return (
    <DataList.Root className="w-full">
      <DataList.Item>
        <DataList.Label minWidth="88px">Form Id</DataList.Label>
        <DataList.Value>
          <Flex align="center" gap="2">
            <Code variant="ghost">{params.id}</Code>
            <IconButton
              size="1"
              aria-label="Copy value"
              color="gray"
              variant="ghost"
              onClick={handleFormIdCopy}
            >
              <CopyIcon />
            </IconButton>
          </Flex>
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label minWidth="88px">Form Name</DataList.Label>
        <DataList.Value>
          {formInfoLoading ? (
            <Skeleton>Customer service form</Skeleton>
          ) : (
            formInfoData.data.name
          )}
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label minWidth="88px">Created at</DataList.Label>
        {formInfoLoading ? (
          <Skeleton>8th September 2024 12:00:00</Skeleton>
        ) : (
          new Date(formInfoData.data.createdAt).toLocaleString()
        )}
      </DataList.Item>
      <DataList.Item>
        <DataList.Label minWidth="88px">Active</DataList.Label>
        {formInfoLoading ? (
          <Skeleton className="w-fit">
            <Switch defaultChecked />
          </Skeleton>
        ) : (
          <Switch
            defaultChecked={formInfoData.data.active}
            className="cursor-pointer"
            onClick={handleToggleMutation}
          />
        )}
      </DataList.Item>
      <DataList.Item>
        <Dialog.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
          <Dialog.Trigger asChild>
            <Button color="red" className="cursor-pointer">
              Delete Form
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
            <Dialog.Content className="fixed top-[50%] left-[50%] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-neutral-800 p-6 rounded-lg shadow-lg">
              <Dialog.Title className="text-lg font-bold">
                Confirm Delete
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-neutral-200">
                Are you sure you want to delete this form? This action cannot be
                undone.
              </Dialog.Description>
              <div className="mt-4 flex justify-end space-x-4">
                <Dialog.Close asChild>
                  <Button className="bg-gray-700 py-2 px-4 rounded hover:bg-gray-500 transition-all duration-200">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400 transition-all duration-200"
                  onClick={handleFormDelete}
                >
                  Confirm
                </Button>
              </div>
              <Dialog.Close asChild>
                <button className="absolute top-2.5 right-2.5 text-gray-500 hover:text-gray-700">
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </DataList.Item>
    </DataList.Root>
  );
}
