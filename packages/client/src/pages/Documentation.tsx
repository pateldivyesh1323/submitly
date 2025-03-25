import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrowNight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import environments from "../environments";
import { useState } from "react";
import { Flex, Heading, Select, Separator, Text } from "@radix-ui/themes";

const codeStyle = tomorrowNight;

const curlCode = `curl -X POST "${environments.VITE_SERVER_URL}/form/submit" \\
-H "Content-Type: application/json" \\
-H "form-id: your-form-id" \\
-H "form-api-key: your-form-api-key" \\
-d '{"name": "John Doe", "email": "johndoe@example.com"}'
`;

const JavascriptCode = `const submitForm = async (data) => {
  try {
    await fetch("${environments.VITE_SERVER_URL}/form/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "form-id": "your-form-id", // Replace with your actual form ID
        "form-api-key": "your-form-api-key", // Replace with your actual API key
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

// Example usage
submitForm({ name: "John Doe", email: "johndoe@example.com" });
`;

const pythonCode = `import requests
import json

def submit_form(data):
    url = f"${environments.VITE_SERVER_URL}/form/submit"
    headers = {
        "Content-Type": "application/json",
        "form-id": "your-form-id",  # Replace with your form ID
        "form-api-key": "your-form-api-key",  # Replace with your API key
    }
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        response.raise_for_status()  # Raise an exception for HTTP errors
        print("Response:", response.json())
    except requests.exceptions.RequestException as e:
        print("Error:", e)

# Example usage
submit_form({"name": "John Doe", "email": "johndoe@example.com"})`;

const goCode = `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func submitForm(data map[string]string) error {
	url := fmt.Sprintf("%s/form/submit", "${environments.VITE_SERVER_URL}") // Replace with your actual server URL
	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("form-id", "your-form-id")      // Replace with your form ID
	req.Header.Set("form-api-key", "your-form-api-key")  // Replace with your API key

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("server returned: %v", resp.Status)
	}

	fmt.Println("Form submitted successfully")
	return nil
}

func main() {
	data := map[string]string{
		"name":  "John Doe",
		"email": "johndoe@example.com",
	}
	if err := submitForm(data); err != nil {
		fmt.Println("Error:", err)
	}
}
`;

const Documentation = () => {
  const [codeLanguage, setCodeLanguage] = useState("curl");
  const getCodeSample = () => {
    switch (codeLanguage) {
      case "curl":
        return curlCode;
      case "javascript":
        return JavascriptCode;
      case "python":
        return pythonCode;
      case "go":
        return goCode;
      default:
        return curlCode;
    }
  };

  return (
    <Flex
      direction="column"
      className="gap-8 p-8 w-[80vw] mx-auto text-neutral-300"
    >
      <Heading className="text-center">Documentation</Heading>
      <section>
        <Heading as="h3" className="mb-5">
          Introduction
        </Heading>
        <Flex direction="column">
          <Text>
            Welcome to the API documentation for submitting forms via HTTP POST
            requests. This guide will walk you through the process of sending
            form data to our server using different programming languages and
            cURL.
          </Text>
          <br />
          <Text>
            The form submission endpoint requires specific headers for
            authentication, and you will need to replace placeholders with your
            form's unique ID and API key.
          </Text>
          <br />
          <Text color="gray" size="2">
            Note: The form submissions are currently limited to 10 requests per
            15 minutes per IP Address to decrease spam.
          </Text>
        </Flex>
      </section>
      <Separator className="w-full" />
      <section>
        <Heading as="h5" className="mb-4">
          Steps for integrating
        </Heading>
        <ol className="list-outside list-decimal flex flex-col gap-8">
          <li>
            <Text className="font-semibold">URL:</Text>
            <SyntaxHighlighter language="url" style={codeStyle}>
              {`POST "${environments.VITE_SERVER_URL}/form/submit"`}
            </SyntaxHighlighter>
          </li>

          <li>
            <Text className="font-semibold">Required Headers:</Text>
            <p>
              When making a request, you must include the following headers:
            </p>
            <ol className="list-disc list-inside pl-6 mt-2">
              <li>Content-Type: Always set to "application/json".</li>
              <li>
                form-id: The unique identifier for your form. Replace
                your-form-id with the actual form ID.
              </li>
              <li>
                form-api-key: The API key specific to your form. Replace
                your-form-api-key with the actual API key.
              </li>
            </ol>
          </li>

          <li>
            <Text className="font-semibold">Request Body:</Text>
            <p>The request body should contain the form data as JSON.</p>
          </li>

          <li>
            <Text className="font-semibold">Response:</Text>
            <p>
              Upon successful submission, the server will respond with a success
              message and any relevant data. Ensure to handle responses and
              errors properly in your implementation.
            </p>
          </li>

          <li>
            <Text className="font-semibold">Error Handling:</Text>
            <p>
              If an error occurs during the request, make sure to catch it and
              log or display the appropriate message. Common errors include:
            </p>
            <ol className="list-inside list-disc pl-6 mt-2">
              <li>401 Unauthorized: If the form ID or API key is incorrect.</li>
              <li>
                400 Bad Request: If the form data is malformed or missing
                required fields.
              </li>
            </ol>
          </li>
        </ol>
      </section>

      <section className="mb-6">
        <Flex justify="between">
          <Heading as="h2" size="4" className="mb-4">
            Code Sample
          </Heading>

          <Select.Root
            defaultValue="curl"
            onValueChange={(value) => {
              setCodeLanguage(value);
            }}
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Group>
                <Select.Label>Language</Select.Label>
                <Select.Item value="curl">cURL</Select.Item>
                <Select.Item value="javascript">Javascript</Select.Item>
                <Select.Item value="python">Python</Select.Item>
                <Select.Item value="go">GO</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </Flex>

        <SyntaxHighlighter language={codeLanguage} style={codeStyle}>
          {getCodeSample()}
        </SyntaxHighlighter>
      </section>
    </Flex>
  );
};

export default Documentation;
