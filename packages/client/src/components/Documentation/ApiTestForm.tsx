import { useState } from "react";
import axios from "axios";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrowNight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import environments from "../../environments";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const codeStyle = tomorrowNight;

const ApiTestForm = () => {
  const [formId, setFormId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{
    success: boolean;
    message: string;
    data?: unknown;
  } | null>(null);

  const handleTestSubmit = async () => {
    if (!formId || !apiKey) {
      setResponse({
        success: false,
        message: "Please fill in Form ID and API Key",
      });
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      const response = await axios.post(
        `${environments.VITE_SERVER_URL}/form/submit`,
        { name, email },
        {
          headers: {
            "form-id": formId,
            "form-api-key": apiKey,
          },
        },
      );

      setResponse({
        success: true,
        message: "Form submitted successfully!",
        data: response.data,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data || {};
        setResponse({
          success: false,
          message:
            errorData.message ||
            error.message ||
            `Error: ${error.response?.status} ${error.response?.statusText || "Unknown error"}`,
          data: errorData,
        });
      } else {
        setResponse({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An error occurred while submitting the form",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormId("");
    setApiKey("");
    setName("John Doe");
    setEmail("johndoe@example.com");
    setResponse(null);
  };

  return (
    <Card className="border-neutral-800 bg-neutral-900/50">
      <CardHeader>
        <CardTitle className="text-xl">Try it out</CardTitle>
        <CardDescription className="text-neutral-400">
          Enter your form ID, API key, and test data to verify your API is
          working correctly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-neutral-200 mb-3 pb-2 border-b border-neutral-800">
                  Authentication
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="form-id" className="text-sm font-medium">
                      Form ID <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="form-id"
                      placeholder="your-form-id"
                      value={formId}
                      onChange={(e) => setFormId(e.target.value)}
                      className="bg-neutral-800/50 border-neutral-700 focus:border-neutral-600"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="api-key" className="text-sm font-medium">
                      API Key <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="your-form-api-key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="bg-neutral-800/50 border-neutral-700 focus:border-neutral-600"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-neutral-200 mb-3 pb-2 border-b border-neutral-800">
                  Test Data
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-neutral-800/50 border-neutral-700 focus:border-neutral-600"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="johndoe@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-neutral-800/50 border-neutral-700 focus:border-neutral-600"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleTestSubmit}
                disabled={isLoading || !formId || !apiKey}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Test Request"
                )}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                disabled={isLoading}
                className="border-neutral-700 hover:bg-neutral-800"
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-neutral-200 mb-3 pb-2 border-b border-neutral-800">
              Response
            </h3>
            {response ? (
              <div
                className={`p-4 rounded-lg border transition-all h-full flex flex-col ${
                  response.success
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {response.success ? (
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                  <p
                    className={`font-semibold ${
                      response.success ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {response.success ? "Success" : "Error"}
                  </p>
                </div>
                <p className="text-sm text-neutral-300 mb-3">
                  {response.message}
                </p>
                {response.data !== undefined && (
                  <div className="mt-3 pt-3 border-t border-neutral-800 flex-1 overflow-hidden flex flex-col">
                    <p className="text-xs font-medium text-neutral-400 mb-2">
                      Response Data:
                    </p>
                    <div className="overflow-auto flex-1">
                      <SyntaxHighlighter
                        language="json"
                        style={codeStyle}
                        customStyle={{
                          margin: 0,
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem",
                          padding: "0.75rem",
                          background: "rgba(0, 0, 0, 0.3)",
                        }}
                      >
                        {JSON.stringify(response.data, null, 2)}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[200px] border border-dashed border-neutral-800 rounded-lg bg-neutral-900/30">
                <p className="text-sm text-neutral-500">
                  Response will appear here after submitting the form
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiTestForm;
