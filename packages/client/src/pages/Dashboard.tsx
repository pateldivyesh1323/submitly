import { useQuery } from "@tanstack/react-query";
import { GET_API_KEY } from "../lib/constants";
import { getApiKey } from "../queries/formAPIKey";
import { Flex, Skeleton } from "@radix-ui/themes";
import FormsListing from "../components/FormsListing";
import { CopyIcon, EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const [showKey, setShowKey] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [GET_API_KEY],
    queryFn: getApiKey,
  });

  const apiKey = data?.data.key;

  const toggleShowKey = () => {
    setShowKey((prev) => !prev);
  };

  const handleAPIKeyCopy = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API Key copied to clipboard");
  };

  return (
    <Flex
      align="start"
      justify="center"
      direction="column"
      className="w-full max-w-[80vw] mx-auto mt-10 gap-16"
    >
      <div className="space-y-2">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Your API Key
        </h2>
        <div className="w-full">
          <Flex
            align="center"
            className="border border-blue-600/80 bg-blue-50/10 p-4 rounded-xl w-full overflow-hidden shadow-sm transition-all hover:border-blue-500"
          >
            <div className="flex-grow overflow-hidden">
              {isLoading ? (
                <Skeleton className="w-20">Loading...</Skeleton>
              ) : (
                <code className="block truncate font-mono text-sm">
                  {showKey ? apiKey : "*".repeat(80)}
                </code>
              )}
            </div>

            <Flex align="center" gap="2" className="ml-4 shrink-0">
              <button
                onClick={handleAPIKeyCopy}
                className="p-2 hover:bg-gray-700/10 rounded-full transition-colors"
                aria-label="Copy API Key"
              >
                <CopyIcon className="w-4 h-4" />
              </button>
              <button
                onClick={toggleShowKey}
                className="p-2 hover:bg-gray-700/10 rounded-full transition-colors"
                aria-label={showKey ? "Hide API Key" : "Show API Key"}
              >
                {!showKey ? (
                  <EyeOpenIcon className="w-4 h-4" />
                ) : (
                  <EyeClosedIcon className="w-4 h-4" />
                )}
              </button>
            </Flex>
          </Flex>
        </div>
      </div>

      <FormsListing />
    </Flex>
  );
}
