import { Router } from "express";
import { AdopterController } from "./adopter.controller";
import Guard from "../../middleware/guard";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middleware/validateRequest";
import { adopterValidationSchema } from "./adopter.validation";

const router = Router();

//all access just see the all publisher
router.get("/", AdopterController.getAllPublisher);

router.get("/:id", Guard(UserRole.ADMIN), AdopterController.getSingleAdopter);

router.patch(
  "/:id",
  Guard(UserRole.ADMIN, UserRole.PET_PUBLISHER),
  validateRequest(adopterValidationSchema.updateAdopterValidationSchema),
  AdopterController.updateAdopter
);

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
