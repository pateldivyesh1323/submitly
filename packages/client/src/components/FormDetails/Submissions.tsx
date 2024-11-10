import {
  Button,
  DataList,
  Flex,
  Select,
  Spinner,
  Text,
} from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GET_FORM_SUBMISSIONS } from "../../lib/constants";
import { getFormSubmissions } from "../../queries/form";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export default function Submissions() {
  const navigate = useNavigate();
  const params = useParams();
  const query = new URLSearchParams(location.search);
  const sortBy = query.get("sort") || "latest";
  const currentPage = query.get("page") || "1";

  const [formSubmissions, setFormSubmissions] = useState([{ response: {} }]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: formSubmissionsData, isLoading: formSubmissionsLoading } =
    useQuery({
      queryKey: [GET_FORM_SUBMISSIONS, params.id, currentPage, sortBy],
      queryFn: () => getFormSubmissions(params.id || "", currentPage, sortBy),
    });

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

  const handleSearchChange = () => {
    setSearchQuery("Feature coming soon!");
  };

  return (
    <Flex gap="6" direction="column">
      <Flex justify="between">
        <Flex
          align="center"
          gap="2"
          className="border border-neutral-500 rounded-md py-1 px-2"
        >
          <input
            type="text"
            className="rounded-md text-sm w-[200px] focus:w-[400px] transition-all outline-none pl-1"
            placeholder="Search in submissions"
            onChange={handleSearchChange}
            value={searchQuery}
          />
          <MagnifyingGlassIcon height="20" width="20" />
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
  );
}
