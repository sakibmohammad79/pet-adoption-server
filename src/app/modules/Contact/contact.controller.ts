import { Request, RequestHandler } from "express";
import catchAsync from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { ContactMessageService } from "./contact.service";
import { StatusCodes } from "http-status-codes";

const createContactMessage: RequestHandler = catchAsync(
    async (req, res) => {
      const result = await ContactMessageService.createContactMessgaeIntoDB(req.body);
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Create contact message successfully!",
        data: result,
      });
    }
  );
  export const ContactMessageController = {
    createContactMessage,
  }