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
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error?.name || "Something went wrong!",
      error: error,
    });
  }
};

const getSingleAdmin: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.getSingleAdminById(id);
    res.status(statusCodes.OK).json({
      success: true,
      message: "Single admin fetched successfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err?.name || "Something went wrong!",
      error: err,
    });
  }
};

const updateAdmin: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const result = await AdminServices.updateAdminIntoDB(id, data);
    res.status(statusCodes.OK).json({
      success: true,
      message: "Admin data updated successfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err?.name || "Something went wrong!",
      error: err,
    });
  }
};
const deleteAdmin: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.deleteAdminFromDB(id);
    res.status(statusCodes.OK).json({
      success: true,
      message: "Admin deleted successfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err?.name || "Something went wrong!",
      error: err,
    });
  }
};
const softDeleteAdmin: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.softDeleteAdminFromDB(id);
    res.status(statusCodes.OK).json({
      success: true,
      message: "Admin deleted successfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err?.name || "Something went wrong!",
      error: err,
    });
  }
};

export const AdminController = {
  getAllAdmin,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
