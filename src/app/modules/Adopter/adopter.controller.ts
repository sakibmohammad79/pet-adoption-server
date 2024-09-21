import { RequestHandler } from "express";
import catchAsync from "../../../shared/catchAsync";
import { pick } from "../../../shared/pick";
import { adopterFilterableFields } from "./Adopter.constant";
import { AdopterService } from "./Adopter.service";
import { sendResponse } from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAllPublisher: RequestHandler = catchAsync(async (req, res) => {
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

// const getSinglePublisher: RequestHandler = catchAsync(
//   async (req, res, next) => {
//     const { id } = req.params;
//     const result = await PublisherService.getSinglePublisherById(id);
//     sendResponse(res, {
//       statusCode: StatusCodes.OK,
//       success: true,
//       message: "Single Publisher fetched successfully!",
//       data: result,
//     });
//   }
// );

// const updatePublisher: RequestHandler = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const data = req.body;
//   const result = await PublisherService.updatePublisherIntoDB(id, data);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Publisher data updated successfully!",
//     data: result,
//   });
// });

// const deletePublisher = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const result = await PublisherService.deletePublisherFromDB(id);
//   sendResponse(res, {
//     statusCode: StatusCodes.OK,
//     success: true,
//     message: "Publisher deleted successfully!",
//     data: result,
//   });
// });

// const softDeletePublisher: RequestHandler = catchAsync(
//   async (req, res, next) => {
//     const { id } = req.params;
//     const result = await PublisherService.softDeletePublisherFromDB(id);
//     sendResponse(res, {
//       statusCode: StatusCodes.OK,
//       success: true,
//       message: "Publisher soft deleted successfully!",
//       data: result,
//     });
//   }
// );

export const AdopterController = {
  getAllPublisher,
};
