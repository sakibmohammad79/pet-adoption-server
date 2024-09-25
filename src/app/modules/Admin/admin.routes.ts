import { Router } from "express";
import { AdminController } from "./admin.controller";
import { validateRequest } from "../../middleware/validateRequest";

import { AdminValidationSchema } from "./admin.validations";

import { UserRole } from "@prisma/client";
import Guard from "../../middleware/guard";

const router = Router();

router.get(
  "/adoption-request",
  Guard(UserRole.ADMIN),
  AdminController.allAdoptionRequest
);
router.get("/", Guard(UserRole.ADMIN), AdminController.getAllAdmin);

router.get("/:id", Guard(UserRole.ADMIN), AdminController.getSingleAdmin);

router.patch(
  "/:id",
  Guard(UserRole.ADMIN),
  validateRequest(AdminValidationSchema.updateAdminValidationSchema),
  AdminController.updateAdmin
);

router.delete("/:id", Guard(UserRole.ADMIN), AdminController.deleteAdmin);

router.delete(
  "/soft/:id",
  Guard(UserRole.ADMIN),
  AdminController.softDeleteAdmin
);

router.patch(
  "/pet-publish/:id",
  Guard(UserRole.ADMIN),
  AdminController.petPublish
);

router.patch(
  "/pet-unpublish/:id",
  Guard(UserRole.ADMIN),
  AdminController.petUnpublish
);

router.patch(
  "/pet-adoption-approved/:id",
  Guard(UserRole.ADMIN),
  AdminController.approveAdoption
);

router.patch(
  "/pet-adoption-rejected/:id",
  Guard(UserRole.ADMIN),
  AdminController.rejectAdoption
);

export const AdminRoutes = router;
