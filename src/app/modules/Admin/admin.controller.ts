import { RequestHandler, Response } from "express";
import { AdminServices } from "./admin.service";
import statusCodes from "http-status-codes";
import { pick } from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import { sendResponse } from "../../../shared/sendResponse";

const getAllAdmin: RequestHandler = async (req, res, next) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await AdminServices.getAllAdminFromDB(filters, options);

    sendResponse(res, {
      statusCode: statusCodes.OK,
      success: true,
      message: "All admin fetched!",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    next(error);
  }
};

const getSingleAdmin: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.getSingleAdminById(id);

    sendResponse(res, {
      statusCode: statusCodes.OK,
      success: true,
      message: "Single admin fetched successfully!",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const updateAdmin: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const result = await AdminServices.updateAdminIntoDB(id, data);

    sendResponse(res, {
      statusCode: statusCodes.OK,
      success: true,
      message: "Admin data updated successfully!",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};
const deleteAdmin: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.deleteAdminFromDB(id);

    sendResponse(res, {
      statusCode: statusCodes.OK,
      success: true,
      message: "Admin deleted successfully!",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};
const softDeleteAdmin: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await AdminServices.softDeleteAdminFromDB(id);

    sendResponse(res, {
      statusCode: statusCodes.OK,
      success: true,
      message: "Admin deleted successfully!",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const AdminController = {
  getAllAdmin,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
