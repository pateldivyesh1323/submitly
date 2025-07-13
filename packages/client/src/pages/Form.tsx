import { Box, Flex, Tabs } from "@radix-ui/themes";
import Submissions from "../components/FormDetails/Submissions";
import Analytics from "../components/FormDetails/Analytics";
import { useNavigate } from "react-router-dom";
import Settings from "../components/FormDetails/Settings";
import {
  Settings as SettingsIcon,
  ChartNoAxesCombined,
  Send as SendIcon,
} from "lucide-react";
import { FormProvider } from "../context/FormContext";

export default function FormPage() {
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const tab = query.get("tab") || "submissions";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(location.search);
    params.forEach((_, key) => {
      params.delete(key);
    });
    params.set("tab", value);
    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <FormProvider>
      <Flex
        align="center"
        direction="column"
        justify="center"
        className="mt-4 w-[90vw] mx-auto pb-8"
        gap="8"
      >
        <Tabs.Root
          defaultValue={tab}
          className="w-full"
          onValueChange={handleTabChange}
        >
          <Tabs.List color="blue">
            <Tabs.Trigger value="submissions">
              <SendIcon className="w-4 h-4 mr-2" />
              Submissions
            </Tabs.Trigger>
            <Tabs.Trigger value="analytics">
              <ChartNoAxesCombined className="w-4 h-4 mr-2" />
              Analytics
            </Tabs.Trigger>
            <Tabs.Trigger value="settings">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </Tabs.Trigger>
          </Tabs.List>
          <Box pt="3">
            <Tabs.Content value="submissions">
              <Submissions />
            </Tabs.Content>
            <Tabs.Content value="analytics">
              <Analytics />
            </Tabs.Content>
            <Tabs.Content value="settings">
              <Settings />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Flex>
    </FormProvider>
  );
}
