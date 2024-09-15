import { RequestHandler } from "express";
import { UserServices } from "./user.service";
import { StatusCodes } from "http-status-codes";

const createAdmin: RequestHandler = async (req, res) => {
  // res.send(result);
  try {
    const result = await UserServices.createAdminIntoDB(req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Admin created successfully!",
      data: result,
    });
  } catch (eror: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: eror?.name || "Something went wrong!",
      error: eror,
    });
  }
};

export const UserController = {
  createAdmin,
};
