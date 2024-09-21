import { Prisma, Publisher, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../error/ApiError";
import { StatusCodes } from "http-status-codes";
import { IPaginationOptions } from "../../../interface/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { publisherSearchableFields } from "./publisher.constant";

const getAllPublisherFromDB = async (
  params: any,
  options: IPaginationOptions
) => {
  // console.log(params);
  const { searchTerm, ...filterData } = params;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const andCondition: Prisma.PublisherWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: publisherSearchableFields.map((field) => ({
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
  const whereCondition: Prisma.PublisherWhereInput = { AND: andCondition };

  const result = await prisma.publisher.findMany({
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

  const total = await prisma.publisher.count({
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

const getSinglePublisherById = async (
  id: string
): Promise<Publisher | null> => {
  const publisher = await prisma.publisher.findUniqueOrThrow({
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
      email: publisher.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!isActiveUser) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "This user blocked or deleted by admin!"
    );
  }

  return publisher;
};

export const PublisherService = {
  getSinglePublisherById,
  getAllPublisherFromDB,
};
