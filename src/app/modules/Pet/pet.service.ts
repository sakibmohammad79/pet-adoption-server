import { Pet, Prisma, UserRole, UserStatus } from "@prisma/client";
import { IPet } from "./pet.interface";
import prisma from "../../../shared/prisma";
import { checkIsDeleted } from "../../../helpers/checkIsDeleted";
import { IPaginationOptions } from "../../../interface/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { petSearchableFields } from "./pet.constant";
import ApiError from "../../error/ApiError";
import { StatusCodes } from "http-status-codes";

const getAllPetFromDB = async (params: any, options: IPaginationOptions) => {
  // console.log(params);
  const { searchTerm, ...filterData } = params;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const andCondition: Prisma.PetWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: petSearchableFields.map((field) => ({
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
  const whereCondition: Prisma.PetWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.pet.findMany({
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
      publisher: true,
    },
  });

  const total = await prisma.pet.count({
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

const createPetIntoDB = async (data: IPet, user: any) => {
  // console.log(user);
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      id: user?.userId,
      status: UserStatus.ACTIVE,
      role: UserRole.PET_PUBLISHER,
    },
  });

  //check is user not deleted in admin table(soft delete)
  if (userData.email && userData.role) {
    await checkIsDeleted(userData.email, userData.role);
  }

  const result = await prisma.pet.create({
    data: data,
  });
  return result;
};

const updatePetIntoDB = async (
  id: string,
  payload: Partial<Pet>,
  user: any
): Promise<Pet | null> => {
  const pet = await prisma.pet.findUniqueOrThrow({
    where: {
      id,
      isAdopt: false,
      isBooked: false,
      isDeleted: false,
    },
  });

  const isActiveUser = await prisma.user.findUnique({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!isActiveUser) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "This user blocked or deleted by admin!"
    );
  }

  if (isActiveUser.email && isActiveUser.role) {
    await checkIsDeleted(isActiveUser.email, isActiveUser.role);
  }

  const updatePet = await prisma.pet.update({
    where: {
      id: pet.id,
    },
    data: payload,
  });
  return updatePet;
};

const getSinglePetByID = async (id: string) => {
  const petData = await prisma.pet.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      publisher: true,
    },
  });

  return petData;
};

const deletePetFromDB = async (id: string, user: any): Promise<Pet | null> => {
  // console.log(user);
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
  if (isActiveUser.email && isActiveUser.role) {
    await checkIsDeleted(isActiveUser.email, isActiveUser.role);
  }

  const pet = await prisma.pet.findUnique({
    where: {
      id,
    },
  });

  if (!pet) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Pet not found!");
  }

  if (pet.isAdopt) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "This pet already adopt by adopter!"
    );
  }
  if (pet.isBooked) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "This pet already booked by adopter!"
    );
  }

  const deletePet = await prisma.pet.delete({
    where: {
      id: pet.id,
    },
  });
  return deletePet;
};
const softDeletePetFromDB = async (
  id: string,
  user: any
): Promise<Pet | null> => {
  // console.log(user);
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
  if (isActiveUser.email && isActiveUser.role) {
    await checkIsDeleted(isActiveUser.email, isActiveUser.role);
  }

  const pet = await prisma.pet.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!pet) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Pet not found!");
  }

  if (pet.isAdopt) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "This pet already adopt by adopter!"
    );
  }
  if (pet.isBooked) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "This pet already booked by adopter!"
    );
  }

  const softDeletePet = await prisma.pet.update({
    where: {
      id: pet.id,
    },
    data: {
      isDeleted: true,
      isPublished: false,
    },
  });
  return softDeletePet;
};

export const PetService = {
  createPetIntoDB,
  getAllPetFromDB,
  updatePetIntoDB,
  getSinglePetByID,
  deletePetFromDB,
  softDeletePetFromDB,
};
