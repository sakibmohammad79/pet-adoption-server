import { Request, RequestHandler } from "express";
import catchAsync from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { ContactMessageService } from "./contact.service";
import { StatusCodes } from "http-status-codes";

const createContactMessage: RequestHandler = catchAsync(
    async (req, res) => {
      const result = await ContactMessageService.createContactMessgeIntoDB(req.body);
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Create contact message successfully!",
        data: result,
      });
    }
  );
const getAllContactMessage: RequestHandler = catchAsync(
    async (req, res) => {
      const result = await ContactMessageService.getAllContactMessgeFromDB();
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Get all contact message successfully!",
        data: result,
      });
    }
  );
const deleteContactMessage: RequestHandler = catchAsync(
    async (req, res) => {
      const {id} = req.params;
      const result = await ContactMessageService.deleteMessageFromDB(id);
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Message deleted successfully!",
        data: result,
      });
    }
  );
  export const ContactMessageController = {
    createContactMessage,
    getAllContactMessage,
    deleteContactMessage
  }