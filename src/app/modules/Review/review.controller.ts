import { Request, RequestHandler } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ReviewService } from "./review.service";
import { sendResponse } from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createReview: RequestHandler = catchAsync(
  async (req: Request & { user?: any }, res, next) => {
    const user = req.user;
    const result = await ReviewService.createReviewIntoDB(req.body, user);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Your review submit successfully!",
      data: result,
    });
  }
);
const getAllReview: RequestHandler = catchAsync(
  async (req: Request & { user?: any }, res, next) => {
    const result = await ReviewService.getAllReview();
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All review fetched successfully!",
      data: result,
    });
  }
);
const deleteReview: RequestHandler = catchAsync(
  async (req: Request & { user?: any }, res, next) => {
    const { id } = req.params;
    const result = await ReviewService.deleteReview(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Review delete successfully!",
      data: result,
    });
  }
);
const publishedReview: RequestHandler = catchAsync(
  async (req: Request & { user?: any }, res, next) => {
    const { id } = req.params;
    const result = await ReviewService.publishedReviewIntoDB(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Review published successfully!",
      data: result,
    });
  }
);
const unpublishedReview: RequestHandler = catchAsync(
  async (req: Request & { user?: any }, res, next) => {
    const { id } = req.params;
    const result = await ReviewService.unpublishedReviewIntoDB(id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Review unpublished successfully!",
      data: result,
    });
  }
);

export const ReviewController = {
  createReview,
  getAllReview,
  deleteReview,
  publishedReview,
  unpublishedReview
};
