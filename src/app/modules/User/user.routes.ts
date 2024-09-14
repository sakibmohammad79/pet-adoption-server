import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.post("/", UserController.createAdmin);

export const UserRoutes = router;
