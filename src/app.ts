import express from "express";
import cors from "cors";
import router from "./app/routes";

import globalErrorHandler from "./app/middleware/globalErrorHandler";

const app = express();

app.use(cors());
//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send({
    message: "Pet adoption server...",
  });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

export default app;
