import React, { useState } from "react";
import {
  Button,
  Checkbox,
  DataList,
  Flex,
  Select,
  Spinner,
  Text,
} from "@radix-ui/themes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  DELETE_FORM_SUBMISSIONS,
  GET_FORM_SUBMISSIONS,
} from "../../lib/constants";
import { deleteFormSubmissions, getFormSubmissions } from "../../queries/form";
import { toast } from "sonner";
import { FormSubmissionsType, FormSubmissionType } from "../../types/Form";
import { queryClient } from "../../lib/apiClient";
import { Search, RefreshCcw, Trash2 } from "lucide-react";

export default function Submissions() {
  const navigate = useNavigate();
  const params = useParams();
  const query = new URLSearchParams(location.search);
  const sortBy = query.get("sort") || "latest";
  const currentPage = query.get("page") || "1";

  const [keyword, setKeyword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([]);

  const {
    data: formSubmissionsData,
    isLoading: formSubmissionsLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      GET_FORM_SUBMISSIONS,
      params.id,
      currentPage,
      sortBy,
      searchTerm,
    ],
    queryFn: () =>
      getFormSubmissions(params.id || "", currentPage, sortBy, searchTerm),
  });

  const { mutate: deleteSubmissionsMutation, isPending } = useMutation({
    mutationKey: [DELETE_FORM_SUBMISSIONS, params.id],
    mutationFn: () =>
      deleteFormSubmissions(params.id || "", selectedSubmissions),
    onSuccess: () => {
      toast.success("Submissions deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [
          GET_FORM_SUBMISSIONS,
          params.id,
          currentPage,
          sortBy,
          searchTerm,
        ],
      });
      setSelectedSubmissions([]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleChangeSort = (value: string) => {
    const params = new URLSearchParams(location.search);
    params.set("sort", value);
    params.set("page", "1"); // Reset to first page on sort change
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchTerm(keyword);
    const params = new URLSearchParams(location.search);
    params.set("page", "1"); // Reset to first page on new search
    navigate(`${location.pathname}?${params.toString()}`);
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

  const handleReload = () => {
    refetch();
    toast.success("Submissions reloaded");
  };

  const handleCheckboxChange = (submissionId: string) => {
    setSelectedSubmissions((prev) => {
      if (prev.includes(submissionId)) {
        return prev.filter((id) => id !== submissionId);
      } else {
        return [...prev, submissionId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedSubmissions.length === formSubmissions.length) {
      setSelectedSubmissions([]);
    } else {
      setSelectedSubmissions(
        formSubmissions.map((submission) => submission._id),
      );
    }
  };

  const handleDeleteSelectedSubmissions = () => {
    deleteSubmissionsMutation();
  };

  const formSubmissions: FormSubmissionsType =
    formSubmissionsData?.data?.formSubmissions || [];
  const totalPages = formSubmissionsData?.data?.totalPages || 1;

  return (
    <Flex gap="6" direction="column">
      <Flex justify="between">
        <Flex gap="5" justify="between" align="center">
          <Checkbox
            checked={
              selectedSubmissions.length === formSubmissions.length &&
              formSubmissions.length > 0
            }
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Select all"
            onCheckedChange={handleSelectAll}
          />
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 border border-neutral-500 rounded-md py-1 px-2"
          >
            <input
              type="text"
              className="rounded-md text-sm w-[200px] focus:w-[400px] transition-all outline-none pl-1"
              placeholder="Search in submissions"
              onChange={handleSearchChange}
              value={keyword}
            />
            <button
              type="submit"
              className="bg-transparent border-none p-0"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Search"
            >
              <Search size={17} />
            </button>
          </form>
          <Button
            type="button"
            variant="ghost"
            color="gray"
            className="cursor-pointer"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Refresh"
            onClick={handleReload}
          >
            <RefreshCcw size={17} />
          </Button>
          {selectedSubmissions.length !== 0 && (
            <Button
              type="button"
              variant="ghost"
              className="cursor-pointer"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Delete Selected Submissions"
              onClick={handleDeleteSelectedSubmissions}
              disabled={isPending}
            >
              <Trash2 color="red" size={17} />
            </Button>
          )}
        </Flex>
        <Flex align="center" gap="2">
          <Text size="2">Sort by:</Text>
          <Select.Root defaultValue={sortBy} onValueChange={handleChangeSort}>
            <Select.Trigger />
            <Select.Content>
              <Select.Group>
                <Select.Item value="latest">Latest</Select.Item>
                <Select.Item value="oldest">Oldest</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>
      {formSubmissionsLoading || isPending ? (
        <Spinner />
      ) : isError ? (
        <Text>Error loading submissions.</Text>
      ) : formSubmissions.length === 0 ? (
        <Flex justify="center" align="center" gap="3">
          <Search height="20px" width="20px" className="stroke-neutral-400" />
          <Text className="font-extralight text-neutral-400">
            No Results found!
          </Text>
        </Flex>
      ) : (
        <>
          {formSubmissions.map((data: FormSubmissionType) => (
            <DataList.Root className="w-full" key={data._id}>
              <Flex align="center" className="mr-4">
                <Checkbox
                  checked={selectedSubmissions.includes(data._id)}
                  onCheckedChange={() => handleCheckboxChange(data._id)}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Select"
                />
              </Flex>
              <Flex className="flex-col gap-2">
                {Object.entries(data.response).map(([key, value]) => (
                  <DataList.Item key={key} className="flex">
                    <DataList.Label minWidth="88px" className="capitalize">
                      {key}
                    </DataList.Label>
                    <DataList.Value>{value as string}</DataList.Value>
                  </DataList.Item>
                ))}
              </Flex>
              <DataList.Item className="bg-neutral-600 h-[0.1px]" />
            </DataList.Root>
          ))}
          <Flex justify="between" className="w-full">
            <Button
              color="blue"
              className="cursor-pointer"
              disabled={currentPage === "1"}
              onClick={handleVisitPreviousPage}
            >
              Previous
            </Button>
            <Text color="gray" size="1">
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              color="blue"
              className="cursor-pointer"
              disabled={currentPage === totalPages.toString()}
              onClick={handleVisitNextPage}
            >
              Next
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  );
}
