import { Box, Flex, Tabs, Text } from "@radix-ui/themes";
import Details from "../components/FormDetails/Details";
import Submissions from "../components/FormDetails/Submissions";

export default function FormPage() {
  return (
    <>
      <Flex
        align="center"
        direction="column"
        justify="center"
        className="mt-4 w-[90vw] mx-auto"
        gap="8"
      >
        <Tabs.Root defaultValue="account" className="w-full">
          <Tabs.List color="blue">
            <Tabs.Trigger value="account">Details</Tabs.Trigger>
            <Tabs.Trigger value="documents">Submissions</Tabs.Trigger>
            <Tabs.Trigger value="settings">Analytics</Tabs.Trigger>
          </Tabs.List>
          <Box pt="3">
            <Tabs.Content value="account">
              <Details />
            </Tabs.Content>
            <Tabs.Content value="documents">
              <Submissions />
            </Tabs.Content>
            <Tabs.Content value="settings">
              <Text size="2">Coming soon</Text>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Flex>
    </>
  );
}
