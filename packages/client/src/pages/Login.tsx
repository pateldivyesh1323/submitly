import * as Form from "@radix-ui/react-form";
import { Button, Flex, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { SignUpDataInterface } from "../types/User";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { loginMutation, isLoginLoading } = useAuth();

  const [loginData, setLoginData] = useState<Omit<SignUpDataInterface, "name">>(
    {
      email: "",
      password: "",
    },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (loginData) {
      setLoginData({ ...loginData, [e.target.id]: e.target.value });
    }
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <Flex
      justify="center"
      align="center"
      direction="column"
      className="min-h-[80vh] text-sm"
    >
      <Text className="mb-4">Login</Text>
      <Form.Root
        onSubmit={handleLogin}
        className="w-[360px] border border-neutral-300 p-6 rounded-md"
      >
        <Form.Field name="email" className="grid mb-[10px]">
          <Form.Label htmlFor="email" className="text-lime-300 mb-1">
            Email
          </Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              id="email"
              className="bg-white text-black rounded-md h-10 p-1"
              required
              autoComplete="email"
              value={loginData.email}
              onChange={handleChange}
            />
          </Form.Control>
        </Form.Field>
        <Form.Field name="password" className="grid mb-[10px]">
          <Form.Label htmlFor="password" className="text-lime-300 mb-1">
            Password
          </Form.Label>
          <Form.Control asChild>
            <input
              type="password"
              id="password"
              className="bg-white text-black rounded-md h-10 p-1"
              required
              autoComplete="current-password"
              value={loginData.password}
              onChange={handleChange}
            />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild className="mt-4">
          <Button className="w-full cursor-pointer" loading={isLoginLoading}>
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
