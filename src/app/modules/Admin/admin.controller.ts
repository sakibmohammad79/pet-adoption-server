import { RequestHandler } from "express";
import { AdminServices } from "./admin.service";
import statusCodes from "http-status-codes";
import { pick } from "../../../shared/pick";

const getAllAdmin: RequestHandler = async (req, res) => {
  try {
    const filters = pick(req.query, [
      "name",
      "email",
      "contactNumber",
      "searchTerm",
    ]);
    const result = await AdminServices.getAllAdminFromDB(filters);
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
