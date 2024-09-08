import * as Form from "@radix-ui/react-form";
import { Button, Flex, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";

export default function Login() {
  const handleLogin = () => {};

  return (
    <Flex
      justify="center"
      align="center"
      direction="column"
      className="min-h-[80vh]"
    >
      <Text className="mb-4">Create new account</Text>
      <Form.Root className="w-[360px] border border-neutral-300 p-6 rounded-md">
        <Form.Field name="email" className="grid mb-[10px]">
          <Form.Label className="text-lime-300 mb-1 text-sm">Email</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              id="email"
              className="bg-white text-black rounded-md h-10 p-1"
              required
            />
          </Form.Control>
        </Form.Field>
        <Form.Field name="password" className="grid mb-[10px]">
          <Form.Label className="text-lime-300 mb-1 text-sm">
            Password
          </Form.Label>
          <Form.Control asChild>
            <input
              type="password"
              id="password"
              className="bg-white text-black rounded-md h-10 p-1"
              required
            />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild className="mt-4">
          <Button
            className="w-full cursor-pointer"
            onClick={() => handleLogin()}
          >
            Login
          </Button>
        </Form.Submit>
        <Flex justify="center" className="mt-2">
          <Link to="/signup">
            <Text size="2">Don't have an Account? Signup</Text>
          </Link>
        </Flex>
      </Form.Root>
    </Flex>
  );
}
