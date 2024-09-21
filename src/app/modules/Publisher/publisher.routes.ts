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

router.delete(
  "/:id",
  Guard(UserRole.ADMIN),
  PublisherController.deletePublisher
);
router.delete(
  "/soft/:id",
  Guard(UserRole.ADMIN),
  PublisherController.softDeletePublisher
);

export const PublisherRoutes = router;
