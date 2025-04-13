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

router.delete("/delete-review/:id", Guard(UserRole.ADMIN), ReviewController.deleteReview);
router.patch("/publish-review/:id",  ReviewController.publishedReview);
router.patch("/unpublish-review/:id",  ReviewController.unpublishedReview);

export const ReviewRoutes = router;
