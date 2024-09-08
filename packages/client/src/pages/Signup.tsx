import * as Form from "@radix-ui/react-form";
import { Button, Flex, Text } from "@radix-ui/themes";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { toast } from "sonner";

export default function Signup() {
  const { signUpMutation, isSignUpLoading } = useAuth();

  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (signUpData) {
      setSignUpData({ ...signUpData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    signUpMutation(signUpData);
  };

  return (
    <Flex
      justify="center"
      align="center"
      direction="column"
      className="min-h-[80vh] text-sm"
    >
      <Text className="mb-4">Create new account</Text>
      <Form.Root
        onSubmit={handleSubmit}
        className="w-[360px] border border-neutral-300 p-6 rounded-md"
      >
        <Form.Field name="name" className="grid mb-[10px]">
          <Form.Label htmlFor="name" className="text-lime-300 mb-1">
            Name
          </Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              id="name"
              name="name"
              className="bg-white text-black rounded-md h-10 p-1"
              onChange={handleChange}
              value={signUpData.name}
              required
              autoComplete="name"
            />
          </Form.Control>
        </Form.Field>
        <Form.Field name="email" className="grid mb-[10px]">
          <Form.Label htmlFor="email" className="text-lime-300 mb-1">
            Email
          </Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              id="email"
              name="email"
              className="bg-white text-black rounded-md h-10 p-1"
              required
              onChange={handleChange}
              value={signUpData.email}
              autoComplete="email"
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
              name="password"
              className="bg-white text-black rounded-md h-10 p-1"
              required
              onChange={handleChange}
              value={signUpData.password}
              autoComplete="new-password"
            />
          </Form.Control>
        </Form.Field>
        <Form.Field name="confirmPassword" className="grid mb-[10px]">
          <Form.Label htmlFor="confirmPassword" className="text-lime-300 mb-1">
            Confirm Password
          </Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              id="confirmPassword"
              name="confirmPassword"
              className="bg-white text-black rounded-md h-10 p-1"
              required
              onChange={handleChange}
              autoComplete="new-password"
            />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild className="mt-4">
          <Button className="w-full cursor-pointer" loading={isSignUpLoading}>
            Create new account
          </Button>
        </Form.Submit>
        <Flex justify="center" className="mt-2">
          <Link to="/login">
            <Text size="2">Already have an Account? Login</Text>
          </Link>
        </Flex>
      </Form.Root>
    </Flex>
  );
}
