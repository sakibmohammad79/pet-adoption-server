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

export const ReviewController = {
  createReview,
};
