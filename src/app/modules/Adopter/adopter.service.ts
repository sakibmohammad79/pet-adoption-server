import { Adopter, PetAdoptStatus, Prisma, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../../interface/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelpers";

import ApiError from "../../error/ApiError";
import { StatusCodes } from "http-status-codes";
import { adopterSearchableFields } from "./adopter.constant";

const getAllAdopterFromDB = async (
  params: any,
  options: IPaginationOptions
) => {
  // console.log(params);
  const { searchTerm, ...filterData } = params;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const andCondition: Prisma.AdopterWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: adopterSearchableFields.map((field) => ({
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
    isDeleted: false,
  });

  // console.dir(andCondition, { depth: "infinity" });
  const whereCondition: Prisma.AdopterWhereInput = { AND: andCondition };

  const result = await prisma.adopter.findMany({
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
    include: {
      user: true,
    },
  });

  const total = await prisma.adopter.count({
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

const getSingleAdopterById = async (id: string): Promise<Adopter | null> => {
  const adopter = await prisma.adopter.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: true,
    },
  });

  const isActiveUser = await prisma.user.findUnique({
    where: {
      email: adopter.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!isActiveUser) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "This user blocked or deleted by admin!"
    );
  }

  return adopter;
};

const updateAdopterIntoDB = async (
  id: string,
  payload: Partial<Adopter>
): Promise<Adopter | null> => {
  const adopter = await prisma.adopter.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const isActiveUser = await prisma.user.findUnique({
    where: {
      email: adopter.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!isActiveUser) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "This user blocked or deleted by admin!"
    );
  }

  const updateAdopter = await prisma.adopter.update({
    where: {
      id: adopter.id,
    },
    data: payload,
  });
  return updateAdopter;
};

const deleteAdopterFromDB = async (id: string): Promise<Adopter | null> => {
  const adopter = await prisma.adopter.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const adopterProfileDeleteData = await transactionClient.adopter.delete({
      where: {
        id: adopter.id,
      },
    });
    await transactionClient.user.delete({
      where: {
        email: adopterProfileDeleteData.email,
      },
    });
    return adopterProfileDeleteData;
  });
  return result;
};

const softDeleteAdopterFromDB = async (id: string): Promise<Adopter | null> => {
  const adopter = await prisma.adopter.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const adopterProfileSoftDeleteData = await transactionClient.adopter.update(
      {
        where: {
          id: adopter.id,
        },
        data: {
          isDeleted: true,
        },
      }
    );
    await transactionClient.user.update({
      where: {
        email: adopterProfileSoftDeleteData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return adopterProfileSoftDeleteData;
  });
  return result;
};

const petBookedIntoDB = async (petId: string, adopterId: string) => {
  const adopter = await prisma.adopter.findUniqueOrThrow({
    where: {
      id: adopterId,
      isDeleted: false,
    },
  });
  await prisma.user.findUniqueOrThrow({
    where: {
      email: adopter.email,
      status: UserStatus.ACTIVE,
    },
  });

  const pet = await prisma.pet.findUniqueOrThrow({
    where: {
      id: petId,
      isDeleted: false,
      isPublished: true,
      isBooked: false,
    },
  });

  if (pet.isAdopt || pet.isBooked) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "This pet is either already adopted or booked!"
    );
  }

  const bookedPet = await prisma.pet.update({
    where: {
      id: pet.id,
    },
    data: {
      isBooked: true,
    },
  });

  // Create the booking request (pending approval from admin)
  await prisma.adoption.create({
    data: {
      petId: bookedPet.id,
      adopterId: adopter.id,
    },
  });

  return bookedPet;
};

export const AdopterService = {
  getAllAdopterFromDB,
  getSingleAdopterById,
  updateAdopterIntoDB,
  deleteAdopterFromDB,
  softDeleteAdopterFromDB,
  petBookedIntoDB,
};
