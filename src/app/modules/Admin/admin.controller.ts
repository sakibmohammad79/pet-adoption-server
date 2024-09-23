import { Request, RequestHandler } from "express";
import { AdminServices } from "./admin.service";
import statusCodes from "http-status-codes";
import { pick } from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import { sendResponse } from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const getAllAdmin: RequestHandler = catchAsync(async (req, res) => {
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
});

const getSingleAdmin: RequestHandler = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await AdminServices.getSingleAdminById(id);
  sendResponse(res, {
    statusCode: statusCodes.OK,
    success: true,
    message: "Single admin fetched successfully!",
    data: result,
  });
});

const updateAdmin: RequestHandler = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  const result = await AdminServices.updateAdminIntoDB(id, data);
  sendResponse(res, {
    statusCode: statusCodes.OK,
    success: true,
    message: "Admin data updated successfully!",
    data: result,
  });
});

const deleteAdmin: RequestHandler = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const result = await AdminServices.deleteAdminFromDB(id);

  sendResponse(res, {
    statusCode: statusCodes.OK,
    success: true,
    message: "Admin deleted successfully!",
    data: result,
  });
});
const softDeleteAdmin: RequestHandler = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const result = await AdminServices.softDeleteAdminFromDB(id);

  sendResponse(res, {
    statusCode: statusCodes.OK,
    success: true,
    message: "Admin deleted successfully!",
    data: result,
  });
});
const petPublish: RequestHandler = catchAsync(
  async (req: Request & { user?: any }, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const result = await AdminServices.petPublishIntoDB(id, user);

    sendResponse(res, {
      statusCode: statusCodes.OK,
      success: true,
      message: "Pet published successfully!",
      data: result,
    });
  }
);

export const AdminController = {
  getAllAdmin,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
  petPublish,
};
