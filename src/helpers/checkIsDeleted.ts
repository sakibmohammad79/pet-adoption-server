import { UserRole } from "@prisma/client";
import prisma from "../shared/prisma";
import ApiError from "../app/error/ApiError";
import { StatusCodes } from "http-status-codes";

export const checkIsDeleted = async (email: string, role: string) => {
  let userProfileData = null;
  if (role === UserRole.ADMIN) {
    userProfileData = await prisma.admin.findUnique({
      where: {
        email: email,
        isDeleted: false,
      },
    });
    if (!userProfileData) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "You are unautorized!");
    }
  }

  if (role === UserRole.PET_ADOPTER) {
    userProfileData = await prisma.adopter.findUnique({
      where: {
        email: email,
        isDeleted: false,
      },
    });
    if (!userProfileData) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "You are unautorized!");
    }
  }
  if (role === UserRole.PET_PUBLISHER) {
    userProfileData = await prisma.publisher.findUnique({
      where: {
        email: email,
        isDeleted: false,
      },
    });
    if (!userProfileData) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "You are unautorized!");
    }
  }
  return userProfileData;
};
