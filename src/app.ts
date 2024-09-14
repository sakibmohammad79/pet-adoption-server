import express from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/User/user.routes";
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send({
    message: "Pet adoption server...",
  });
});

app.use("/api/v1/user", UserRoutes);

export default app;
