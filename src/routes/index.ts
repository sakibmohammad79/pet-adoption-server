import { Router } from "express";
import { UserRoutes } from "../app/modules/User/user.routes";
import { AdminRoutes } from "../app/modules/Admin/admin.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
