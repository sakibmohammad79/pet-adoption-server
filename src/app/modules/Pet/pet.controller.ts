import { RequestHandler } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PetService } from "./pet.service";
import { sendResponse } from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createPet: RequestHandler = catchAsync(async (req, res, next) => {
  const result = await PetService.createPetIntoDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Pet created successfully!",
    data: result,
  });
});

export const PetController = {
  createPet,
};
