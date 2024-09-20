import { RequestHandler } from "express";
import { UserServices } from "./user.service";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const createAdmin: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await UserServices.createAdminIntoDB(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin created successfully!",
    data: result,
  });
});
const createPetPublisher: RequestHandler = catchAsync(
  async (req, res, next) => {
    const result = await UserServices.createPetPublisherIntoDB(req);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Pet Publisher created successfully!",
      data: result,
    });
  }
);

export const UserController = {
  createAdmin,
  createPetPublisher,
};
