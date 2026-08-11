import { z } from "zod";

const categoryNameSchema = z
  .string()
  .trim()
  .min(1, "Category name is required")
  .max(100, "Category name must contain at most 100 characters");

const categoryStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const createCategorySchema = z
  .object({
    name: categoryNameSchema,
    status: categoryStatusSchema.optional(),
  })
  .strict();

export const updateCategorySchema = z
  .object({
    name: categoryNameSchema.optional(),
    status: categoryStatusSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
