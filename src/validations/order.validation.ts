import { z } from "zod";

const orderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

export const createOrderSchema = z
  .object({
    items: z
      .array(
        z
          .object({
            productId: z.string().uuid("productId must be a valid UUID"),
            quantity: z
              .number()
              .int("Quantity must be an integer")
              .positive("Quantity must be greater than zero"),
          })
          .strict()
      )
      .min(1, "Order must contain at least one item"),
  })
  .strict();

export const updateOrderSchema = z
  .object({
    status: orderStatusSchema,
  })
  .strict();
