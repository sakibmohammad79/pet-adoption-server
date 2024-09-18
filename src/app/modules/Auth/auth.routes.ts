import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthValidationSchema } from "./auth.validation";

const router = Router();

router.post(
  "/login",
  validateRequest(AuthValidationSchema.loginValidationSchema),
  AuthController.loginUser
);

router.post("/refresh-token", AuthController.refreshToken);

export const AuthRoutes = router;
