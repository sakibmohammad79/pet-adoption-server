import { RequestHandler } from "express";
import catchAsync from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "./auth.service";

const loginUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthService.loginUserIntoDB(req.body);
  const { refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User login successfully!",
    data: {
      accessToken: result.accessToken,
    },
  });
});
const refreshToken: RequestHandler = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Send refresh token successfully!",
    data: result,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
};
