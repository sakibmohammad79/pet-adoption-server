import { RequestHandler } from "express";
import catchAsync from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "./auth.service";

const loginUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthService.loginUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User login successfully!",
    data: result,
  });
});

export const AuthController = {
  loginUser,
};
