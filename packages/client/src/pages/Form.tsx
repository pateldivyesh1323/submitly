import { CopyIcon } from "@radix-ui/react-icons";
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

export default function FormPage() {
  const params = useParams();

  const { data: formInfoData, isLoading: formInfoLoading } = useQuery({
    queryKey: [GET_FORM_INFO, params.id],
    queryFn: () => getFormInfo(params.id || ""),
  });

  const { data: formSubmissionsData, isLoading: formSubmissionsLoading } =
    useQuery({
      queryKey: [GET_FORM_SUBMISSIONS, params.id],
      queryFn: () => getFormSubmissions(params.id || ""),
    });

  console.log(formSubmissionsData);

  const handleFormIdCopy = () => {
    navigator.clipboard.writeText(params.id || "");
    toast.success("Form ID copied to clipboard");
  };

  console.log(formSubmissionsData);

  return (
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
          ))
        ) : (
          <Text>Error loading submissions.</Text>
        )}
      </Flex>
      <Flex justify="between" className="w-full">
        <Button>Previous</Button>
        <Button>Next</Button>
      </Flex>
    </Flex>
  );
}
