import { useQuery } from "@tanstack/react-query";
import { GET_API_KEY } from "../lib/constants";
import { getApiKey } from "../queries/formAPIKey";
import { Flex, Separator } from "@radix-ui/themes";

export default function Dashboard() {
  const { data } = useQuery({
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
      <Flex direction="column">
        <Flex
          align="center"
          className="border border-orange-400 p-4 rounded-xl"
        >
          <span className="w-max">API KEY</span>{" "}
          <Separator className="mx-[15px]" decorative orientation="vertical" />
          <span className="overflow-auto">{apiKey}</span>
        </Flex>
      </Flex>
    </Flex>
  );
}
