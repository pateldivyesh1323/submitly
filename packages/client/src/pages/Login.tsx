import { Button, Flex, Text } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { loginMutation, isLoginLoading } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormValues) {
    loginMutation(data);
  }

  return (
    <Flex
      justify="center"
      align="center"
      direction="column"
      className="min-h-[80vh] text-sm"
    >
      <Text className="mb-4 text-lg font-medium text-neutral-100">Login</Text>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[360px] border border-neutral-700 bg-darkSecondaryCust p-6 rounded-lg space-y-4 shadow-md"
        >
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
                    autoComplete="current-password"
                    className="bg-neutral-900 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                  />
                </FormControl>
                <FormMessage className="dark:text-red-500 font-medium" />
              </FormItem>
            )}
          />

          <Button
            className="w-full cursor-pointer mt-2"
            loading={isLoginLoading}
            color="orange"
          >
            Login
          </Button>

          <Flex justify="center" className="mt-4">
            <Link to="/signup">
              <Text
                size="2"
                className="text-neutral-400 hover:text-orange-500 transition-colors"
              >
                Don't have an Account? Signup
              </Text>
            </Link>
          </Flex>
        </form>
      </Form>
    </Flex>
  );
}
