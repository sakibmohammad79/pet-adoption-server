import { Router } from "express";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/", AdminController.getAllAdmin);

router.get("/:id", AdminController.getSingleAdmin);

router.patch("/:id", AdminController.updateAdmin);

router.delete("/:id", AdminController.deleteAdmin);

export const AdminRoutes = router;
