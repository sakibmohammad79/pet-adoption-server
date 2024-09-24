import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import { UserValidationSchema } from "./user.validation";
import { UserRole } from "@prisma/client";
import Guard from "../../middleware/guard";
import { imageUploader } from "../../../helpers/imageUploader";
import { validateRequest } from "../../middleware/validateRequest";

const router = Router();

router.get("/", Guard(UserRole.ADMIN), UserController.getAllUser);

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
  imageUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidationSchema.createPetPublisherValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserController.createPetPublisher(req, res, next);
  }
);

router.post(
  "/create-adopter",
  imageUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidationSchema.createPetAdopterValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserController.createPetAdopter(req, res, next);
  }
);

router.patch(
  "/status/:id",
  Guard(UserRole.ADMIN),
  validateRequest(UserValidationSchema.changeUserStatusSchema),
  UserController.changeUserStatus
);

export const UserRoutes = router;
