import { z } from "zod";

export const userSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = userSchema.omit({ _id: true });

export type User = z.infer<typeof userSchema>;
export type SignUpDataInterface = z.infer<typeof signUpSchema>;
