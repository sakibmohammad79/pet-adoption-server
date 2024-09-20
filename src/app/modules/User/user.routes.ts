import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import { UserValidationSchema } from "./user.validation";
import { UserRole } from "@prisma/client";
import Guard from "../../middleware/guard";
import { imageUploader } from "../../../helpers/imageUploader";

const router = Router();

router.post(
  "/create-admin",
  Guard(UserRole.ADMIN),
  imageUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidationSchema.createAdminValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserController.createAdmin(req, res, next);
  }
);
router.post(
  "/create-publisher",
  // Guard(UserRole.PET_PUBLISHER),
  imageUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidationSchema.createPetPublisherValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserController.createPetPublisher(req, res, next);
  }
);

export const UserRoutes = router;
