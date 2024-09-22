import { Pet, Prisma, UserRole, UserStatus } from "@prisma/client";
import { IPet } from "./pet.interface";
import prisma from "../../../shared/prisma";
import { checkIsDeleted } from "../../../helpers/checkIsDeleted";
import { IPaginationOptions } from "../../../interface/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { petSearchableFields } from "./pet.constant";
import { number } from "zod";

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
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      id: user.userId,
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

export const PetService = {
  createPetIntoDB,
  getAllPetFromDB,
};
