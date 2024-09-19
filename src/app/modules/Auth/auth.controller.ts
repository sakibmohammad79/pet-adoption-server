import { Request, RequestHandler } from "express";
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
    message: "generate re-access token successfully!",
    data: result,
  });
});
const changePassword: RequestHandler = catchAsync(
  async (req: Request & { user?: any }, res) => {
    const user = req.user;
    const payload = req.body;
    const result = await AuthService.changePassword(user, payload);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password change successfully!",
      data: result,
    });
  }
);
const forgotPassword: RequestHandler = catchAsync(async (req: Request, res) => {
  const payload = req.body;
  const result = await AuthService.forgotPassword(payload);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Send forgot password link in your email!",
    data: result,
  });
});

const resetPassword: RequestHandler = catchAsync(async (req: Request, res) => {
  const token = req.headers.authorization || "";
  await AuthService.resetPassword(req.body, token);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password reset successfully!",
    data: null,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
