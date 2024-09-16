import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req?.originalUrl,
      message: "Your requested url is not found!",
    },
  });
};

export default notFoundHandler;
