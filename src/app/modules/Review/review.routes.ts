import { Router } from "express";
import { ReviewController } from "./review.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { UserRole } from "@prisma/client";
import Guard from "../../middleware/guard";
import { ReviewValidationSchema } from "./review.validation";

const router = Router();

router.post(
  "/",
  Guard(UserRole.PET_ADOPTER, UserRole.PET_PUBLISHER),
  validateRequest(ReviewValidationSchema.createReviewValidationSchema),
  ReviewController.createReview
);

router.get("/", ReviewController.getAllReview);

router.delete("/:id", Guard(UserRole.ADMIN), ReviewController.deleteReview);

export const ReviewRoutes = router;
