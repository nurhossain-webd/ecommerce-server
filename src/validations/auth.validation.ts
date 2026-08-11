import { z } from "zod";

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email("Email must be valid")
      .transform((email) => email.toLowerCase()),
    password: z.string().min(1, "Password is required"),
  })
  .strict();
