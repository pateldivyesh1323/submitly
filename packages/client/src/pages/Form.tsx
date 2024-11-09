import { CopyIcon, Cross2Icon } from "@radix-ui/react-icons";
import {
  Button,
  Code,
  DataList,
  Flex,
  Heading,
  IconButton,
  Select,
  Separator,
  Skeleton,
  Spinner,
  Switch,
  Text,
} from "@radix-ui/themes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  deleteForm,
  getFormInfo,
  getFormSubmissions,
  toggleFormActivation,
} from "../queries/form";
import {
  DELETE_FORM,
  GET_FORM_INFO,
  GET_FORM_SUBMISSIONS,
  TOGGLE_FORM_ACTIVATION,
} from "../lib/constants";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { getErrorMessage } from "../lib/error";
import { queryClient } from "../lib/apiClient";

export default function FormPage() {
  const params = useParams();
  const query = new URLSearchParams(location.search);
  const currentPage = query.get("page") || "1";
  const sortBy = query.get("sort") || "latest";
  const navigate = useNavigate();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formSubmissions, setFormSubmissions] = useState([{ response: {} }]);
  const [totalPages, setTotalPages] = useState(1);

  const { data: formInfoData, isLoading: formInfoLoading } = useQuery({
    queryKey: [GET_FORM_INFO, params.id],
    queryFn: () => getFormInfo(params.id || ""),
  });

  const { data: formSubmissionsData, isLoading: formSubmissionsLoading } =
    useQuery({
      queryKey: [GET_FORM_SUBMISSIONS, params.id, currentPage, sortBy],
      queryFn: () => getFormSubmissions(params.id || "", currentPage, sortBy),
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

  const handleVisitNextPage = () => {
    const params = new URLSearchParams(location.search);
    params.set(
      "page",
      (parseInt(params.get("page") || "1", 10) + 1).toString(),
    );
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleVisitPreviousPage = () => {
    const params = new URLSearchParams(location.search);
    params.set(
      "page",
      (parseInt(params.get("page") || "1", 10) - 1).toString(),
    );
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleChangeSort = (value: string) => {
    const params = new URLSearchParams(location.search);
    params.set("sort", value);
    navigate(`${location.pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (formSubmissionsData) {
      setFormSubmissions(formSubmissionsData.data.formSubmissions);
      setTotalPages(formSubmissionsData.data.totalPages);
    }
  }, [formSubmissionsData]);

  return (
    <>
      <Flex
        align="center"
        direction="column"
        justify="center"
        className="mt-4 w-[90vw] mx-auto"
        gap="8"
      >
        <Heading as="h1">Details</Heading>
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
                    Are you sure you want to delete this form? This action
                    cannot be undone.
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
        <Flex className="w-full" direction="column" justify="center" gap="4">
          <Flex className="w-full" justify="between">
            <Heading as="h2">Submissions</Heading>
            <Select.Root defaultValue={sortBy} onValueChange={handleChangeSort}>
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Sort by:</Select.Label>
                  <Select.Item value="latest">Latest</Select.Item>
                  <Select.Item value="oldest">Oldest</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </Flex>
          <Separator className="w-full h-[2px]" color="lime" />{" "}
          {formSubmissionsLoading ? (
            <Spinner />
          ) : formSubmissions && formSubmissions.length === 0 ? (
            <Text>No submissions found!</Text>
          ) : formSubmissions ? (
            <>
              {formSubmissions.map((data, index) => (
                <DataList.Root className="w-full" key={index}>
                  {Object.entries(data.response).map(([key, value]) => (
                    <DataList.Item key={key}>
                      <DataList.Label minWidth="88px" className="capitalize">
                        {key}
                      </DataList.Label>
                      <DataList.Value>{value as string}</DataList.Value>
                    </DataList.Item>
                  ))}
                  <DataList.Item className="bg-neutral-600 h-[0.1px]"></DataList.Item>
                </DataList.Root>
              ))}
              <Flex justify="between" className="w-full">
                <Button
                  color="blue"
                  className="cursor-pointer"
                  disabled={currentPage == "1"}
                  onClick={handleVisitPreviousPage}
                >
                  Previous
                </Button>
                <Text color="gray">
                  Page {currentPage} of {totalPages}
                </Text>
                <Button
                  color="blue"
                  className="cursor-pointer"
                  disabled={currentPage == totalPages.toString()}
                  onClick={handleVisitNextPage}
                >
                  Next
                </Button>
              </Flex>
            </>
          ) : (
            <Text>Error loading submissions.</Text>
          )}
        </Flex>
      </Flex>
    </>
  );
}
