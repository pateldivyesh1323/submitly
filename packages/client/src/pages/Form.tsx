import { CopyIcon, Cross2Icon } from "@radix-ui/react-icons";
import {
  Button,
  Code,
  DataList,
  Flex,
  Heading,
  IconButton,
  Separator,
  Skeleton,
  Spinner,
  Text,
} from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { getFormInfo, getFormSubmissions } from "../queries/form";
import { GET_FORM_INFO, GET_FORM_SUBMISSIONS } from "../lib/constants";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

export default function FormPage() {
  const params = useParams();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: formInfoData, isLoading: formInfoLoading } = useQuery({
    queryKey: [GET_FORM_INFO, params.id],
    queryFn: () => getFormInfo(params.id || ""),
  });

  const { data: formSubmissionsData, isLoading: formSubmissionsLoading } =
    useQuery({
      queryKey: [GET_FORM_SUBMISSIONS, params.id],
      queryFn: () => getFormSubmissions(params.id || ""),
    });

  const handleFormIdCopy = () => {
    navigator.clipboard.writeText(params.id || "");
    toast.success("Form ID copied to clipboard");
  };

  const handleFormDelete = () => {
    // Yet to be implemented
    console.log("Form deleted");
    setIsFormOpen(false);
  };

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
            <Dialog.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
              <Dialog.Trigger asChild>
                <Button color="red">Delete Form</Button>
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
          <Heading as="h2">Submissions</Heading>
          <Separator className="w-full h-[2px]" color="lime" />{" "}
          {formSubmissionsLoading ? (
            <Spinner />
          ) : formSubmissionsData && formSubmissionsData.data.length === 0 ? (
            <Text>No submissions found!</Text>
          ) : formSubmissionsData ? (
            formSubmissionsData.data.map((data: any) => (
              <>
                <DataList.Root className="w-full">
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
                <Flex justify="between" className="w-full">
                  <Button color="blue" className="cursor-pointer">
                    Previous
                  </Button>
                  <Button color="blue" className="cursor-pointer">
                    Next
                  </Button>
                </Flex>
              </>
            ))
          ) : (
            <Text>Error loading submissions.</Text>
          )}
        </Flex>
      </Flex>
    </>
  );
}
