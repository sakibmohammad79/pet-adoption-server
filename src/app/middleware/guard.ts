import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpers/jwtHelper";
import config from "../../config";
import { StatusCodes } from "http-status-codes";
import ApiError from "../error/ApiError";

const Guard = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
      }
      const decodedData = await jwtHelpers.verifyToken(
        token,
        config.jwt.access_token_secret as string
      );

      req.user = decodedData;

      if (roles.length && !roles.includes(decodedData.role)) {
        throw new ApiError(StatusCodes.FORBIDDEN, "You are not authorized!");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default Guard;
