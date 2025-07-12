import { useQuery } from "@tanstack/react-query";
import { GET_API_KEY } from "../lib/constants";
import { getApiKey } from "../queries/formAPIKey";
import { Skeleton } from "../components/ui/skeleton";
import { Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import FormsListing from "../components/FormsListing";

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
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    toast.success("API Key copied to clipboard");
  };

  return (
    <div className="w-full max-w-[80vw] mx-auto mt-10 flex flex-col gap-16 items-start justify-center">
      <div className="space-y-2 w-full">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Your API Key
        </h2>
        <div className="w-full">
          <div className="border border-blue-600/80 bg-blue-50/10 p-4 rounded-xl w-full overflow-hidden shadow-xs transition-all hover:border-blue-500 flex items-center">
            <div className="grow overflow-hidden">
              {isLoading ? (
                <Skeleton className="w-full h-5" />
              ) : (
                <code className="block truncate font-mono text-sm">
                  {showKey ? apiKey : "*".repeat(apiKey?.length || 80)}
                </code>
              )}
            </div>

            <div className="flex items-center gap-2 ml-4 shrink-0">
              <button
                onClick={handleAPIKeyCopy}
                className="p-2 hover:bg-gray-700/10 rounded-full transition-colors"
                aria-label="Copy API Key"
                disabled={!apiKey}
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={toggleShowKey}
                className="p-2 hover:bg-gray-700/10 rounded-full transition-colors"
                aria-label={showKey ? "Hide API Key" : "Show API Key"}
                disabled={!apiKey}
              >
                {!showKey ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <FormsListing />
    </div>
  );
}
