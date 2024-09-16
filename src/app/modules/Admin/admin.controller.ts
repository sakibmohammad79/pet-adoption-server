import { RequestHandler } from "express";
import { AdminServices } from "./admin.service";
import statusCodes from "http-status-codes";
import { pick } from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";

const getAllAdmin: RequestHandler = async (req, res) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await AdminServices.getAllAdminFromDB(filters, options);
    res.status(statusCodes.OK).json({
      success: true,
      message: "All admin fetched!",
      data: result,
    });
  } catch (error: any) {
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
