import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthValidationSchema } from "./auth.validation";
import { AuthService } from "./auth.service";
import Guard from "../../middleware/guard";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/login",
  validateRequest(AuthValidationSchema.loginValidationSchema),
  AuthController.loginUser
);

router.post("/refresh-token", AuthController.refreshToken);

router.post(
  "/change-password",
  Guard(UserRole.ADMIN, UserRole.PET_ADOPTER, UserRole.PET_PUBLISHER),
  AuthController.changePassword
);
router.post("/forgot-password", AuthController.forgotPassword);

router.post("/reset-password", AuthController.resetPassword);

export const AuthRoutes = router;
