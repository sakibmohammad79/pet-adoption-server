import { Admin, PetAdoptStatus, Prisma, UserStatus } from "@prisma/client";

import { adminSearchableFields } from "./admin.constant";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import prisma from "../../../shared/prisma";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../../interface/pagination";
import ApiError from "../../error/ApiError";
import { StatusCodes } from "http-status-codes";
import { checkIsDeleted } from "../../../helpers/checkIsDeleted";

const getAllAdminFromDB = async (
  params: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  // console.log(params);
  const { searchTerm, ...filterData } = params;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const andCondition: Prisma.AdminWhereInput[] = [];
  // [
  //   {
  //     email: {
  //       contains: params.searchTerm,
  //       mode: "insensitive",
  //     },
  //   },
  //   {
  //     name: {
  //       contains: params.searchTerm,
  //       mode: "insensitive",
  //     },
  //   },
  // ],

  if (params.searchTerm) {
    andCondition.push({
      OR: adminSearchableFields.map((field) => ({
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
  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };

  const result = await prisma.admin.findMany({
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

  const total = await prisma.admin.count({
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

const getSingleAdminById = async (id: string): Promise<Admin | null> => {
  const admin = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const isActiveUser = await prisma.user.findUnique({
    where: {
      email: admin.email,
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

  return admin;
};

const updateAdminIntoDB = async (
  id: string,
  payload: Partial<Admin>
): Promise<Admin | null> => {
  const admin = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const isActiveUser = await prisma.user.findUnique({
    where: {
      email: admin.email,
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

  const updatedAdmin = await prisma.admin.update({
    where: {
      id: admin.id,
    },
    data: payload,
  });
  return updatedAdmin;
};

const deleteAdminFromDB = async (id: string): Promise<Admin | null> => {
  const admin = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminProfileDeleteData = await transactionClient.admin.delete({
      where: {
        id: admin.id,
      },
    });
    await transactionClient.user.delete({
      where: {
        email: adminProfileDeleteData.email,
      },
    });
    return adminProfileDeleteData;
  });
  return result;
};
const softDeleteAdminFromDB = async (id: string): Promise<Admin | null> => {
  const admin = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminProfileSoftDeleteData = await transactionClient.admin.update({
      where: {
        id: admin.id,
      },
      data: {
        isDeleted: true,
      },
    });
    await transactionClient.user.update({
      where: {
        email: adminProfileSoftDeleteData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return adminProfileSoftDeleteData;
  });
  return result;
};

const petPublishIntoDB = async (id: string, user: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.userId,
      status: UserStatus.ACTIVE,
    },
  });
  await prisma.admin.findUniqueOrThrow({
    where: {
      email: userData?.email,
      isDeleted: false,
    },
  });
  const pet = await prisma.pet.findFirstOrThrow({
    where: {
      id,
    },
  });
  const publishedPet = await prisma.pet.update({
    where: {
      id: pet.id,
      isPublished: false,
    },
    data: {
      isPublished: true,
    },
  });
  return publishedPet;
};

const approveAdoption = async (adoptionId: string) => {
  // Find the adoption request
  const adoption = await prisma.adoption.findUnique({
    where: { id: adoptionId },
    include: { pet: true },
  });

  if (!adoption) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Pet adoption not found.");
  }

  if (adoption.adoptionStatus === PetAdoptStatus.APPROVED) {
    throw new ApiError(StatusCodes.NOT_FOUND, "The pet already adopted!.");
  }

  // Update the adoption status to approved
  const updateAdoption = await prisma.adoption.update({
    where: { id: adoptionId },
    data: { adoptionStatus: PetAdoptStatus.APPROVED },
  });

  if (updateAdoption.adoptionStatus === PetAdoptStatus.APPROVED) {
    // Mark the pet as adopted and update the adoption status
    const updatedPet = await prisma.pet.update({
      where: { id: adoption.petId },
      data: { isAdopt: true, isBooked: false, isPublished: false }, // Mark as adopted, unpublish from homepage
    });
  }

  return updateAdoption;
};
const rejectAdoption = async (adoptionId: string) => {
  // Find the adoption request
  const adoption = await prisma.adoption.findUnique({
    where: { id: adoptionId, adoptionStatus: PetAdoptStatus.PENDING },
    include: { pet: true },
  });

  if (!adoption) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Pet adoption not found.");
  }

  if (adoption.adoptionStatus === PetAdoptStatus.APPROVED) {
    throw new ApiError(StatusCodes.NOT_FOUND, "The pet already adopted!.");
  }

  // Update the adoption status to approved
  const updateAdoption = await prisma.adoption.update({
    where: { id: adoptionId },
    data: { adoptionStatus: PetAdoptStatus.PENDING },
  });

  if (updateAdoption.adoptionStatus === PetAdoptStatus.PENDING) {
    // Mark the pet as adopted and update the adoption status
    const updatedPet = await prisma.pet.update({
      where: { id: adoption.petId },
      data: { isAdopt: false, isBooked: false, isPublished: true }, // Mark as adopted, unpublish from homepage
    });
  }

  return updateAdoption;
};

const getAllAdoptionRequest = async (user: any) => {
  console.log(user);
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.userId,
      status: UserStatus.ACTIVE,
    },
  });
  await prisma.admin.findUniqueOrThrow({
    where: {
      email: userData?.email,
      isDeleted: false,
    },
  });
  const allAdoptionRequest = await prisma.adoption.findMany();
  return allAdoptionRequest;
};

export const AdminServices = {
  getAllAdminFromDB,
  getSingleAdminById,
  updateAdminIntoDB,
  deleteAdminFromDB,
  softDeleteAdminFromDB,
  petPublishIntoDB,
  approveAdoption,
  rejectAdoption,
  getAllAdoptionRequest,
};
