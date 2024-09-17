import { useQuery } from "@tanstack/react-query";
import { GET_FORMS } from "../lib/constants";
import { getForms } from "../queries/form";
import { Button, Flex, Heading, Skeleton, Table, Text } from "@radix-ui/themes";
import { FormType } from "../types/Form";
import { CopyIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import CreateForm from "./CreateForm";

export default function FormsListing() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: [GET_FORMS],
    queryFn: getForms,
  });

  const formsData = data?.data;

  return (
    <Flex align="center" justify="center" direction="column" className="w-full">
      <Flex justify="between" align="center" className="mb-4 w-full">
        <Heading>Your forms</Heading>
        <CreateForm />
      </Flex>
      {isLoading && <Skeleton>Loading</Skeleton>}
      <Table.Root variant="surface" className="w-full">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Form name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Form ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Table.Row key={index}>
                <Table.RowHeaderCell>
                  {" "}
                  <Skeleton> Lorem, ipsum.</Skeleton>
                </Table.RowHeaderCell>
                <Table.Cell>
                  <Skeleton>Lorem, ipsum.</Skeleton>
                </Table.Cell>
                <Table.Cell>
                  <Skeleton>Lorem, ipsum.</Skeleton>
                </Table.Cell>
              </Table.Row>
            ))
          ) : formsData && formsData.length !== 0 ? (
            formsData.map((data: FormType) => (
              <Table.Row key={data.formId}>
                <Table.RowHeaderCell>{data.name}</Table.RowHeaderCell>
                <Table.Cell className="flex h-full">
                  <Text className="mr-2">{data.formId}</Text>
                  <CopyIcon
                    color="gray"
                    onClick={() => {
                      navigator.clipboard.writeText(data.formId);
                      toast.success("Copied to clipboard");
                    }}
                    className="cursor-pointer"
                  />
                </Table.Cell>
                <Table.Cell>
                  <Button
                    size="1"
                    variant="solid"
                    className="cursor-pointer"
                    onClick={() => {
                      navigate(`/form/${data.formId}`);
                    }}
                  >
                    Visit
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.RowHeaderCell>No forms to show</Table.RowHeaderCell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
}
