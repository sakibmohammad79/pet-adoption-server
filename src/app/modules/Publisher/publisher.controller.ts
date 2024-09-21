import { RequestHandler } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PublisherService } from "./publisher.service";
import { sendResponse } from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { pick } from "../../../shared/pick";
import { publisherFilterableFields } from "./publisher.constant";

const getAllPublisher: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, publisherFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await PublisherService.getAllPublisherFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All Pet Publisher fetched!",
    meta: result.meta,
    data: result.data,
  });
});

const getSinglePublisher: RequestHandler = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const result = await PublisherService.getSinglePublisherById(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Single Publisher fetched successfully!",
      data: result,
    });
  }
);

export const PublisherController = {
  getSinglePublisher,
  getAllPublisher,
};
