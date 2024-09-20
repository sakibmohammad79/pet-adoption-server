import { Router } from "express";
import { UserController } from "./user.controller";
import { UserValidationSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { UserRole } from "@prisma/client";
import Guard from "../../middleware/guard";
import { imageUploader } from "../../../helpers/imageUploader";

const router = Router();

router.post(
  "/",
  Guard(UserRole.ADMIN),
  imageUploader.upload.single("file"),
  validateRequest(UserValidationSchema.createAdminValidationSchema),
  UserController.createAdmin
);

export const UserRoutes = router;
