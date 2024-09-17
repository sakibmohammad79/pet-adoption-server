import { Router } from "express";
import { AdminController } from "./admin.controller";
import { validateRequest } from "../../middleware/validateRequest";

import { AdminValidationSchema } from "./admin.validations";

const router = Router();

router.get("/", AdminController.getAllAdmin);

router.get("/:id", AdminController.getSingleAdmin);

router.patch(
  "/:id",
  validateRequest(AdminValidationSchema.updateAdminValidationSchema),
  AdminController.updateAdmin
);

router.delete("/:id", AdminController.deleteAdmin);

router.delete("/soft/:id", AdminController.softDeleteAdmin);

export const AdminRoutes = router;
