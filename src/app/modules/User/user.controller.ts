import { RequestHandler } from "express";
import { UserServices } from "./user.service";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../shared/sendResponse";

const createAdmin: RequestHandler = async (req, res, next) => {
  // res.send(result);
  try {
    const result = await UserServices.createAdminIntoDB(req.body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin created successfully!",
      data: result,
    });
  } catch (eror: any) {
    next(eror);
  }
};

export const UserController = {
  createAdmin,
};
