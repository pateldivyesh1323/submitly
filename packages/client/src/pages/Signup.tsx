import { Button, Flex, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function Signup() {
  const { signUpMutation, isSignUpLoading } = useAuth();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: SignUpFormValues) {
    signUpMutation(data);
  }

  return (
    <Flex
      justify="center"
      align="center"
      direction="column"
      className="min-h-[80vh] text-sm"
    >
      <Text className="mb-4 text-lg font-medium text-neutral-100">
        Create new account
      </Text>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[360px] border border-neutral-700 bg-dark-secondary-cust p-6 rounded-lg space-y-4 shadow-md"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-200">Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="name"
                    className="bg-neutral-900 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                  />
                </FormControl>
                <FormMessage className="dark:text-red-500 font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-200">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    autoComplete="email"
                    className="bg-neutral-900 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                  />
                </FormControl>
                <FormMessage className="dark:text-red-500 font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-200">Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    className="bg-neutral-900 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                  />
                </FormControl>
                <FormMessage className="dark:text-red-500 font-medium" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-200">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    className="bg-neutral-900 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                  />
                </FormControl>
                <FormMessage className="dark:text-red-500 font-medium" />
              </FormItem>
            )}
          />

          <Button
            className="w-full cursor-pointer mt-2"
            loading={isSignUpLoading}
            color="orange"
          >
            Create new account
          </Button>

          <Flex justify="center" className="mt-4">
            <Link to="/login">
              <Text
                size="2"
                className="text-neutral-400 hover:text-orange-500 transition-colors"
              >
                Already have an Account? Login
              </Text>
            </Link>
          </Flex>
        </form>
      </Form>
    </Flex>
  );
}
