import { NextFunction, Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PetService } from "./pet.service";
import { sendResponse } from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { pick } from "../../../shared/pick";
import { petFilterableFields } from "./pet.constant";

const getAllPet: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, petFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await PetService.getAllPetFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All Pet fetched!",
    meta: result.meta,
    data: result.data,
  });
});

const createPet: RequestHandler = catchAsync(
  async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await PetService.createPetIntoDB(req.body, user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Pet created successfully!",
      data: result,
    });
  }
);

const updatePet: RequestHandler = catchAsync(
  async (req: Request & { user?: any }, res, next) => {
    const { id } = req.params;
    const data = req.body;
    const user = req.user;
    const result = await PetService.updatePetIntoDB(id, data, user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Pet data updated successfully!",
      data: result,
    });
  }
);
const getSinglePet: RequestHandler = catchAsync(
  async (req: Request, res, next) => {
    const { id } = req.params;
    const result = await PetService.getSinglePetByID(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Pet data fetched successfully!",
      data: result,
    });
  }
);
const deletePet: RequestHandler = catchAsync(
  async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const result = await PetService.deletePetFromDB(id, user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Pet deleted successfully!",
      data: result,
    });
  }
);
const softDeletePet: RequestHandler = catchAsync(
  async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;

    const result = await PetService.softDeletePetFromDB(id, user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Pet soft deleted successfully!",
      data: result,
    });
  }
);
export const PetController = {
  createPet,
  getAllPet,
  updatePet,
  getSinglePet,
  deletePet,
  softDeletePet,
};
