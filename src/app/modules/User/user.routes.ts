import { Router } from "express";
import { UserController } from "./user.controller";
import { UserValidationSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

router.post(
  "/",
  validateRequest(UserValidationSchema.createAdminValidationSchema),
  UserController.createAdmin
);

export const UserRoutes = router;
