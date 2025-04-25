import {
  Admin,
  Adopter,
  Prisma,
  Publisher,
  UserRole,
  UserStatus,
} from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { imageUploader } from "../../../helpers/imageUploader";
import { IFile } from "../../../interface/file";
import { Request } from "express";
import { IPaginationOptions } from "../../../interface/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { userSearchableFields } from "./user.constant";
import ApiError from "../../error/ApiError";
import { StatusCodes } from "http-status-codes";

const createAdminIntoDB = async (
  req: Request & { user?: any }
): Promise<Admin> => {
  const file = req.file as IFile;

  if (file) {
    const uploadToCloundinary = await imageUploader.imageUploadToCloudinary(
      file
    );
    req.body.admin.profilePhoto = uploadToCloundinary?.secure_url;
  }

  const admin = await prisma.user.findUnique({
    where: {
      email: req.body.admin.email,
    },
  });

  if (admin) {
    throw new ApiError(StatusCodes.CONFLICT, "This email already registered!");
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: {
        password: hashedPassword,
        email: req.body.admin.email,
        role: UserRole.ADMIN,
      },
    });

    const createdAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });

    return createdAdminData;
  });

  return result;
};

const createPetPublisherIntoDB = async (req: Request): Promise<Publisher> => {
  const file = req.file as IFile;

  if (file) {
    const uploadToCloundinary = await imageUploader.imageUploadToCloudinary(
      file
    );
    req.body.publisher.profilePhoto = uploadToCloundinary?.secure_url;
  }
  const publisher = await prisma.user.findUnique({
    where: {
      email: req.body.publisher.email,
    },
  });

  if (publisher) {
    throw new ApiError(StatusCodes.CONFLICT, "This email already registered!");
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: {
        password: hashedPassword,
        email: req.body.publisher.email,
        role: UserRole.PET_PUBLISHER,
      },
    });

    const createdPetPublisherData = await transactionClient.publisher.create({
      data: req.body.publisher,
    });

    return createdPetPublisherData;
  });

  return result;
};

const createPetAdopterIntoDB = async (req: Request): Promise<Adopter> => {
  const file = req.file as IFile;

  if (file) {
    const uploadToCloundinary = await imageUploader.imageUploadToCloudinary(
      file
    );
    req.body.adopter.profilePhoto = uploadToCloundinary?.secure_url;
  }

  const adopter = await prisma.user.findUnique({
    where: {
      email: req.body.adopter.email,
    },
  });

  if (adopter) {
    throw new ApiError(StatusCodes.CONFLICT, "This email already registered!");
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: {
        password: hashedPassword,
        email: req.body.adopter.email,
        role: UserRole.PET_ADOPTER,
      },
    });

    const createdPetAdopterData = await transactionClient.adopter.create({
      data: req.body.adopter,
    });

    return createdPetAdopterData;
  });

  return result;
};

const getAllUserFromDB = async (params: any, options: IPaginationOptions) => {
  const { searchTerm, ...filterData } = params;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const andCondition: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  //search field exact same

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  andCondition.push({
    role: {
      not: UserRole.ADMIN, // Exclude users with the 'ADMIN' role
    },
  });

  //becuase admin see all user
  // andCondition.push({
  //   isDeleted: false,
  // });

  // console.dir(andCondition, { depth: "infinity" });
  const whereCondition: Prisma.UserWhereInput = andCondition.length
    ? { AND: andCondition }
    : {};

  const result = await prisma.user.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      publisher: true,
      adopter: true,
    },
  });

  const total = await prisma.user.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const changeUserStatus = async (id: string, status: UserRole) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: status,
  });
  return updateUserStatus;
};

const getMyProfile = async (user: any) => {
 

  const userData = await prisma.user.findFirstOrThrow({
    where: {
      id: user.userId,
      status: UserStatus.ACTIVE,
    },
    include: {
      admin: true,
      publisher: true,
      adopter: true,
    },
  });

  return userData;
};

export const UserServices = {
  createAdminIntoDB,
  createPetPublisherIntoDB,
  createPetAdopterIntoDB,
  getAllUserFromDB,
  changeUserStatus,
  getMyProfile,
};
