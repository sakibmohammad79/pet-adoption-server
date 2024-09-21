import { UserRole } from "@prisma/client";
import prisma from "../shared/prisma";
import ApiError from "../app/error/ApiError";
import { StatusCodes } from "http-status-codes";

export const checkIsDeleted = async (email: string, role: string) => {
  if (role === UserRole.ADMIN) {
    const admin = await prisma.admin.findUnique({
      where: {
        email: email,
        isDeleted: false,
      },
    });
    if (!admin) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "You are unautorized!");
    }
  }

  if (role === UserRole.PET_ADOPTER) {
    const admin = await prisma.adopter.findUnique({
      where: {
        email: email,
        isDeleted: false,
      },
    });
    if (!admin) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "You are unautorized!");
    }
  }
  if (role === UserRole.PET_PUBLISHER) {
    const admin = await prisma.publisher.findUnique({
      where: {
        email: email,
        isDeleted: false,
      },
    });
    if (!admin) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "You are unautorized!");
    }
  }
};
