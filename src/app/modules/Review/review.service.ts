import { UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IReview } from "./review.interface";
import ApiError from "../../error/ApiError";
import { StatusCodes } from "http-status-codes";
import { checkIsDeleted } from "../../../helpers/checkIsDeleted";

const createReviewIntoDB = async (data: IReview, user: any) => {
  console.log(data, "data");
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
  console.log(userProfileData);
  if (!(userProfileData?.id === data.reviewerId)) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "You are unauthorized!!");
  }

  let reviewerData = null;

  if (isActiveUser.role === UserRole.PET_ADOPTER) {
    reviewerData = await prisma.review.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        photo: userProfileData.profilePhoto || "https://i.postimg.cc/Pxf7WpS0/user.png",
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
        photo: userProfileData.profilePhoto || "https://i.postimg.cc/Pxf7WpS0/user.png",
        publisherId: data.reviewerId, // Set to null
        adopterId: null, // Ensure this ID exists in the Adopter table
      },
    });
  }
  return reviewerData;
};

const getAllReview = async () => {
  const allReview = await prisma.review.findMany({
    include: {
      publisher: true,
      adopter: true,
    },
  });
  return allReview;
};

const deleteReview = async (id: string) => {
  const review = await prisma.review.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const deleteReview = await prisma.review.delete({
    where: {
      id: review.id,
    },
  });

  return deleteReview;
};

const publishedReviewIntoDB = async (id: string) => {
  const review = await prisma.review.findUniqueOrThrow({
    where: {
      id,
      isPublished: false
    },
  });
  if(!review){
    throw new ApiError(StatusCodes.NOT_FOUND, "Review not found for publish!")
  }

  const result = await prisma.review.update({
    where: {
      id
    },
    data: {isPublished: true}
  })
  return result
}
const unpublishedReviewIntoDB = async (id: string) => {
  const review = await prisma.review.findUniqueOrThrow({
    where: {
      id,
      isPublished: true
    },
  });
  if(!review){
    throw new ApiError(StatusCodes.NOT_FOUND, "Review not found for unpublished!")
  }

  const result = await prisma.review.update({
    where: {
      id
    },
    data: {isPublished: false}
  })
  return result
}

export const ReviewService = {
  createReviewIntoDB,
  getAllReview,
  deleteReview,
  publishedReviewIntoDB,
  unpublishedReviewIntoDB
};
