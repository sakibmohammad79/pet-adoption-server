import { Request, RequestHandler } from "express";
import { UserServices } from "./user.service";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { pick } from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";

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
const createPetAdopter: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await UserServices.createPetAdopterIntoDB(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Pet Adopter created successfully!",
    data: result,
  });
});

const getAllUser: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await UserServices.getAllUserFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All user fetched!",
    meta: result.meta,
    data: result.data,
  });
});

const changeUserStatus: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.changeUserStatus(id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User status change successfully!",
    data: result,
  });
});
const myProfile: RequestHandler = catchAsync(
  async (req: Request & { user?: any }, res) => {
    const { user } = req;
    const result = await UserServices.getMyProfile(user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Profile data fetched successfully!",
      data: result,
    });
  }
);

export const UserController = {
  createAdmin,
  createPetPublisher,
  createPetAdopter,
  getAllUser,
  changeUserStatus,
  myProfile,
};
