import { z } from "zod";

const ratingSchema = z
  .number()
  .int("Rating must be an integer")
  .min(1, "Rating must be at least 1")
  .max(5, "Rating must be at most 5");

const commentSchema = z
  .string()
  .trim()
  .max(1000, "Comment must contain at most 1000 characters");

export const createReviewSchema = z
  .object({
    rating: ratingSchema,
    comment: commentSchema.optional(),
    productId: z.string().uuid("productId must be a valid UUID"),
  })
  .strict();

export const updateReviewSchema = z
  .object({
    rating: ratingSchema.optional(),
    comment: commentSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
