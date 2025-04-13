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

const updatePublisherIntoDB = async (
  id: string,
  payload: Partial<Publisher>
): Promise<Publisher | null> => {
  const publisher = await prisma.publisher.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
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

  const updatePublisher = await prisma.publisher.update({
    where: {
      id: publisher.id,
    },
    data: payload,
  });
  return updatePublisher;
};

const deletePublisherFromDB = async (id: string): Promise<Publisher | null> => {
  const publisher = await prisma.publisher.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const publisherProfileDeleteData = await transactionClient.publisher.delete(
      {
        where: {
          id: publisher.id,
        },
      }
    );
    await transactionClient.user.delete({
      where: {
        email: publisherProfileDeleteData.email,
      },
    });
    return publisherProfileDeleteData;
  });
  return result;
};

const softDeletePublisherFromDB = async (
  id: string
): Promise<Publisher | null> => {
  const publisher = await prisma.publisher.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const publisherProfileSoftDeleteData =
      await transactionClient.publisher.update({
        where: {
          id: publisher.id,
        },
        data: {
          isDeleted: true,
        },
      });
    await transactionClient.user.update({
      where: {
        email: publisherProfileSoftDeleteData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return publisherProfileSoftDeleteData;
  });
  return result;
};

const getAllMyCreatedPet = async (id: string) => {
  const publisher = await prisma.publisher.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
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

  const myCreatedPet = await prisma.pet.findMany({
    where: {
      publisherId: publisher.id,
      isDeleted: false,
    },
    // include: {
    //   publisher: true,
    // },
  });

  return myCreatedPet;
};

const getAllMyPublishedPetIntoDB = async(id: string) => {
  const result = await prisma.pet.findMany({
    where: {
      publisherId: id,
      isPublished: true
    }
  })
  return result
}

export const PublisherService = {
  getSinglePublisherById,
  getAllPublisherFromDB,
  updatePublisherIntoDB,
  deletePublisherFromDB,
  softDeletePublisherFromDB,
  getAllMyCreatedPet,
  getAllMyPublishedPetIntoDB
};
