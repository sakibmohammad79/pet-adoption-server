import { Router } from "express";
import { AdopterController } from "./adopter.controller";

const router = Router();

//all access just see the all publisher
router.get("/", AdopterController.getAllPublisher);

// router.get(
//   "/:id",
//   Guard(UserRole.ADMIN),
//   PublisherController.getSinglePublisher
// );

// router.patch(
//   "/:id",
//   Guard(UserRole.ADMIN, UserRole.PET_PUBLISHER),
//   validateRequest(publisherValidationSchema.updatePublisherValidationSchema),
//   PublisherController.updatePublisher
// );

// router.delete(
//   "/:id",
//   Guard(UserRole.ADMIN),
//   PublisherController.deletePublisher
// );
// router.delete(
//   "/soft/:id",
//   Guard(UserRole.ADMIN),
//   PublisherController.softDeletePublisher
// );

export const AdopterRoutes = router;
