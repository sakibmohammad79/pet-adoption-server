import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpers/jwtHelper";
import config from "../../config";

const Guard = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new Error("You are not authorized!");
      }
      const decodedData = await jwtHelpers.verifyToken(
        token,
        config.jwt.access_token_secret as string
      );
      if (roles.length && !roles.includes(decodedData.role)) {
        throw new Error("You are not authorized!");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default Guard;
