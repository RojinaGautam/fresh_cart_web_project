import { z } from "zod";

export const MIN_RATING = 1;
export const MAX_RATING = 5;

export const ReviewSchema = z.object({
  product: z.string().min(1, "Product is required"),
  user: z.string().min(1, "User is required"),
  rating: z.number().int().min(MIN_RATING).max(MAX_RATING),
  comment: z.string().min(1, "Comment is required"),
});

export type ReviewType = z.infer<typeof ReviewSchema>;
