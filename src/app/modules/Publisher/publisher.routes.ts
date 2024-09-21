import { Router } from "express";
import { UserRole } from "@prisma/client";
import Guard from "../../middleware/guard";
import { PublisherController } from "./publisher.controller";

const router = Router();

//all access just see the all publisher
router.get("/", PublisherController.getAllPublisher);

router.get(
  "/:id",
  Guard(UserRole.ADMIN),
  PublisherController.getSinglePublisher
);

export const PublisherRoutes = router;
