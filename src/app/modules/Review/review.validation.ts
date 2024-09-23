import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    rating: z
      .number()
      .int({ message: "Rating must be an integer." })
      .min(1, { message: "Rating must be at least 1." })
      .max(5, { message: "Rating must be at most 5." }),
    comment: z.string({ message: "Comment is required." }),
    reviewerId: z.string({ message: "Reviewer ID is required." }),
  }),
});

export const ReviewValidationSchema = {
  createReviewValidationSchema,
};
