import { Admin, Prisma, UserStatus } from "@prisma/client";

import { adminSearchableFields } from "./admin.constant";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import prisma from "../../../shared/prisma";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../../interface/pagination";
import ApiError from "../../error/ApiError";
import { StatusCodes } from "http-status-codes";

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

export const AdminServices = {
  getAllAdminFromDB,
  getSingleAdminById,
  updateAdminIntoDB,
  deleteAdminFromDB,
  softDeleteAdminFromDB,
};
