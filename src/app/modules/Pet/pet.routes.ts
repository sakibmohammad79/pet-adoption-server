import { Router } from "express";
import { PetController } from "./pet.controller";
import Guard from "../../middleware/guard";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/", Guard(UserRole.PET_PUBLISHER), PetController.createPet);

export const PetRoutes = router;
