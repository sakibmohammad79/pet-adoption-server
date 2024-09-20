import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import { UserValidationSchema } from "./user.validation";
import { UserRole } from "@prisma/client";
import Guard from "../../middleware/guard";
import { imageUploader } from "../../../helpers/imageUploader";

const router = Router();

router.post(
  "/",
  Guard(UserRole.ADMIN),
  imageUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidationSchema.createAdminValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserController.createAdmin(req, res, next);
  }
);

export const UserRoutes = router;
