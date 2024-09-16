import { Router } from "express";
import { AdminController } from "./admin.controller";
import { AdminServices } from "./admin.service";

const router = Router();

router.get("/", AdminController.getAllAdmin);
router.get("/:id", AdminController.getSingleAdmin);
router.patch("/:id", AdminController.updateAdmin);

export const AdminRoutes = router;
