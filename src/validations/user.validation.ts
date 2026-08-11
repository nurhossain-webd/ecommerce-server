import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must contain at least 2 characters")
  .max(100, "Name must contain at most 100 characters");

const emailSchema = z
  .string()
  .trim()
  .email("Email must be valid")
  .transform((email) => email.toLowerCase());

export const createUserSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .max(72, "Password must contain at most 72 characters"),
  })
  .strict();

export const updateUserSchema = z
  .object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
