import { Router } from "express";
import { AdopterController } from "./adopter.controller";
import Guard from "../../middleware/guard";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middleware/validateRequest";
import { adopterValidationSchema } from "./adopter.validation";

const router = Router();

router.patch(
  "/pet-booked",
  Guard(UserRole.PET_ADOPTER),
  AdopterController.petBooked
);

//all access just see the all publisher
router.get("/", AdopterController.getAllPublisher);

router.get("/:id", Guard(UserRole.ADMIN), AdopterController.getSingleAdopter);

router.patch(
  "/:id",
  Guard(UserRole.ADMIN, UserRole.PET_PUBLISHER),
  validateRequest(adopterValidationSchema.updateAdopterValidationSchema),
  AdopterController.updateAdopter
);

router.delete("/:id", Guard(UserRole.ADMIN), AdopterController.deleteAdopter);

router.delete(
  "/soft/:id",
  Guard(UserRole.ADMIN),
  AdopterController.softDeleteAdopter
);

export const AdopterRoutes = router;
