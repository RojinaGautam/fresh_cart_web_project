import { z } from "zod";
import { MAX_RATING, MIN_RATING } from "../types/review.type";

export const CreateReviewDTO = z.object({
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(MIN_RATING, `Rating must be at least ${MIN_RATING}`)
    .max(MAX_RATING, `Rating must be at most ${MAX_RATING}`),
  comment: z
    .string()
    .trim()
    .min(1, "Comment is required")
    .max(1000, "Comment must be 1000 characters or fewer"),
});

export type CreateReviewDTO = z.infer<typeof CreateReviewDTO>;

export const UpdateReviewDTO = CreateReviewDTO;

export type UpdateReviewDTO = z.infer<typeof UpdateReviewDTO>;
