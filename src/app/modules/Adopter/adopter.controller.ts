import { Request, RequestHandler } from "express";
import catchAsync from "../../../shared/catchAsync";
import { pick } from "../../../shared/pick";
import { sendResponse } from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { adopterFilterableFields } from "./adopter.constant";
import { AdopterService } from "./adopter.service";

const getAllAdopter: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, adopterFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await AdopterService.getAllAdopterFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All Pet Adopter fetched!",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAdopter: RequestHandler = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await AdopterService.getSingleAdopterById(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Single Adopter fetched successfully!",
    data: result,
  });
});

const updateAdopter: RequestHandler = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  const result = await AdopterService.updateAdopterIntoDB(id, data);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Adopter data updated successfully!",
    data: result,
  });
});

const deleteAdopter = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await AdopterService.deleteAdopterFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Adopter deleted successfully!",
    data: result,
  });
});

const softDeleteAdopter: RequestHandler = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await AdopterService.softDeleteAdopterFromDB(id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Adopter soft deleted successfully!",
    data: result,
  });
});
const petBooked: RequestHandler = catchAsync(
  async (req: Request & { user?: any }, res, next) => {
    const { petId, adopterId } = req.body;
    const result = await AdopterService.petBookedIntoDB(petId, adopterId);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Pet booked successfully!",
      data: result,
    });
  }
);

const myBookedPet: RequestHandler = catchAsync(
  async (req: Request & { user?: any }, res, next) => {
    const { id } = req.params;
    const result = await AdopterService.getAllMyBookedPet(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "My adopt pet fetched successfully!",
      data: result,
    });
  }
);
const myAdoptedPet: RequestHandler = catchAsync(
  async (req: Request & { user?: any }, res, next) => {
    const { id } = req.params;
    const result = await AdopterService.getAllMyAdoptedPet(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "My adopt pet fetched successfully!",
      data: result,
    });
  }
);

export const AdopterController = {
  getAllAdopter,
  getSingleAdopter,
  updateAdopter,
  deleteAdopter,
  softDeleteAdopter,
  petBooked,
  myBookedPet,
  myAdoptedPet,
};
