import { useQuery } from "@tanstack/react-query";
import { GET_API_KEY } from "../lib/constants";
import { getApiKey } from "../queries/formAPIKey";
import { Flex, Separator, Skeleton } from "@radix-ui/themes";
import FormsListing from "../components/FormsListing";

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: [GET_API_KEY],
    queryFn: getApiKey,
  });

  const apiKey = data?.data.key;

  return (
    <Flex
      align="center"
      justify="center"
      direction="column"
      className="w-[80vw] mx-auto mt-10"
    >
      <Flex direction="column" className="mb-8">
        <Flex align="center" className="border border-blue-600 p-4 rounded-xl">
          <span className="w-max">API KEY</span>{" "}
          <Separator className="mx-[15px]" decorative orientation="vertical" />
          <span className="overflow-hidden">
            {isLoading ? (
              <Skeleton width="80px">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio
                sunt voluptatem, alias aliquid, ducimus cupiditate culpa saepe
              </Skeleton>
            ) : (
              apiKey
            )}
          </span>
        </Flex>
      </Flex>
      <FormsListing />
    </Flex>
  );
}
