import { Router } from "express";
import { PetController } from "./pet.controller";
import Guard from "../../middleware/guard";
import { UserRole } from "@prisma/client";
import { validateRequest } from "../../middleware/validateRequest";
import { petValidationSchema } from "./pet.validation";

const router = Router();

router.get("/", PetController.getAllPet);

router.get("/:id", PetController.getSinglePet);

router.post(
  "/",
  Guard(UserRole.PET_PUBLISHER),
  validateRequest(petValidationSchema.createPetSchema),
  PetController.createPet
);
router.patch(
  "/:id",
  Guard(UserRole.ADMIN, UserRole.PET_PUBLISHER),
  validateRequest(petValidationSchema.updatePetSchema),
  PetController.updatePet
);

router.delete("/:id", Guard(UserRole.ADMIN), PetController.deletePet);

router.delete(
  "/soft/:id",
  Guard(UserRole.ADMIN, UserRole.PET_PUBLISHER),
  PetController.softDeletePet
);

export const PetRoutes = router;
