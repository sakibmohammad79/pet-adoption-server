import { Router } from "express";
import { AdopterController } from "./adopter.controller";
import Guard from "../../middleware/guard";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middleware/validateRequest";
import { adopterValidationSchema } from "./adopter.validation";

const router = Router();

//all access just see the all publisher
router.get("/", AdopterController.getAllAdopter);

router.get("/:id", AdopterController.getSingleAdopter);

router.get(
  "/booked-pet/:id",
  Guard(UserRole.PET_ADOPTER),
  AdopterController.myBookedPet
);
router.get(
  "/adopted-pet/:id",
  Guard(UserRole.PET_ADOPTER),
  AdopterController.myAdoptedPet
);

router.patch(
  "/pet-booked",
  Guard(UserRole.PET_ADOPTER),
  AdopterController.petBooked
);

router.patch(
  "/:id",
  Guard(UserRole.ADMIN, UserRole.ADMIN, UserRole.PET_ADOPTER),
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
