import { UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IReview } from "./review.interface";
import ApiError from "../../error/ApiError";
import { StatusCodes } from "http-status-codes";
import { checkIsDeleted } from "../../../helpers/checkIsDeleted";

const createReviewIntoDB = async (data: IReview, user: any) => {
  const isActiveUser = await prisma.user.findUnique({
    where: {
      id: user.userId,
      status: UserStatus.ACTIVE,
    },
  });
  if (!isActiveUser) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "This user blocked or deleted by admin!"
    );
  }
  let userProfileData = null;
  if (isActiveUser.email && isActiveUser.role) {
    userProfileData = await checkIsDeleted(
      isActiveUser.email,
      isActiveUser.role
    );
  }
  if (!(userProfileData?.id === data.reviewerId)) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "You are unauthorized!");
  }

  let reviewerData = null;

  if (isActiveUser.role === UserRole.PET_ADOPTER) {
    reviewerData = await prisma.review.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        adopterId: data.reviewerId, // Ensure this ID exists in the Adopter table
        publisherId: null, // Set to null
      },
    });
  }
  if (isActiveUser.role === UserRole.PET_PUBLISHER) {
    reviewerData = await prisma.review.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        publisherId: data.reviewerId, // Set to null
        adopterId: null, // Ensure this ID exists in the Adopter table
      },
    });
  }

  return reviewerData;
};

export const ReviewService = {
  createReviewIntoDB,
};
