import express from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFoundHandler from "./app/middleware/notFoundHandler";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(cookieParser());
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

app.use(notFoundHandler);

export default app;
