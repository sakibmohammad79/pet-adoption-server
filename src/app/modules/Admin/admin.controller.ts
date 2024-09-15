import { RequestHandler } from "express";
import { AdminServices } from "./admin.service";
import statusCodes from "http-status-codes";

const getAllAdmin: RequestHandler = async (req, res) => {
  try {
    const result = await AdminServices.getAllAdminFromDB();
    res.status(statusCodes.OK).json({
      success: true,
      message: "All admin fetched!",
      data: result,
    });
  } catch (error) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error?.name || "Something went wrong!",
      error: error,
    });
  }
};

export const AdminController = {
  getAllAdmin,
};
