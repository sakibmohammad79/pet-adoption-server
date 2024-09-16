import { Admin, Prisma, UserStatus } from "@prisma/client";

import { adminSearchableFields } from "./admin.constant";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import prisma from "../../../shared/prisma";

const getAllAdminFromDB = async (params: any, options: any) => {
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
          equals: filterData[key],
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
  const result = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
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
