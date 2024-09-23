import { Router } from "express";
import { UserRoutes } from "../modules/User/user.routes";
import { AdminRoutes } from "../modules/Admin/admin.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { PublisherRoutes } from "../modules/Publisher/publisher.routes";
import { AdopterRoutes } from "../modules/Adopter/adopter.routes";
import { PetRoutes } from "../modules/Pet/pet.routes";
import { ReviewRoutes } from "../modules/Review/review.routes";

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
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/publisher",
    route: PublisherRoutes,
  },
  {
    path: "/adopter",
    route: AdopterRoutes,
  },
  {
    path: "/pet",
    route: PetRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
