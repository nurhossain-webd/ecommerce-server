import { z } from "zod";

const productStatusSchema = z.enum([
  "ACTIVE",
  "OUT_OF_STOCK",
  "INACTIVE",
]);

const productFields = {
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(200, "Product name must contain at most 200 characters"),
  description: z.string().trim().max(2000).optional(),
  price: z.number().min(0, "Price cannot be negative"),
  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative"),
  categoryId: z.string().uuid("categoryId must be a valid UUID"),
  status: productStatusSchema,
};

export const createProductSchema = z
  .object({
    name: productFields.name,
    description: productFields.description,
    price: productFields.price,
    stock: productFields.stock.optional(),
    categoryId: productFields.categoryId,
    status: productFields.status.optional(),
  })
  .strict();

export const updateProductSchema = z
  .object({
    name: productFields.name.optional(),
    description: productFields.description,
    price: productFields.price.optional(),
    stock: productFields.stock.optional(),
    categoryId: productFields.categoryId.optional(),
    status: productFields.status.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
