import { Box, Flex, Tabs } from "@radix-ui/themes";
import Details from "../components/FormDetails/Details";
import Submissions from "../components/FormDetails/Submissions";
import Analytics from "../components/FormDetails/Analytics";
import { useNavigate } from "react-router-dom";

export default function FormPage() {
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const tab = query.get("tab") || "details";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(location.search);
    params.forEach((_, key) => {
      params.delete(key);
    });
    params.set("tab", value);
    navigate(`${location.pathname}?${params.toString()}`);
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
        <Tabs.Root
          defaultValue={tab}
          className="w-full"
          onValueChange={handleTabChange}
        >
          <Tabs.List color="blue">
            <Tabs.Trigger value="details">Details</Tabs.Trigger>
            <Tabs.Trigger value="submissions">Submissions</Tabs.Trigger>
            <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
          </Tabs.List>
          <Box pt="3">
            <Tabs.Content value="details">
              <Details />
            </Tabs.Content>
            <Tabs.Content value="submissions">
              <Submissions />
            </Tabs.Content>
            <Tabs.Content value="analytics">
              <Analytics />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Flex>
    </>
  );
}
