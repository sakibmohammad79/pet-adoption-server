import { Adopter, PetAdoptStatus, Prisma, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../../interface/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelpers";

import ApiError from "../../error/ApiError";
import { StatusCodes } from "http-status-codes";
import { adopterSearchableFields } from "./adopter.constant";
import emailSender from "../Auth/emialSender";

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
      isBooked: false,
    },
    data: {
      isBooked: true,
    },
  });

  if (bookedPet.isBooked) {
    await emailSender(
      adopter.email,
      "Pet Booked",
      `<body style="font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; padding-bottom: 20px;">
        <h2 style="color: #4CAF50; font-size: 24px; margin: 0;">Pet Booking Confirmed!</h2>
        <p style="font-size: 16px; color: #555;">You've successfully booked your pet!</p>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
        <p style="font-size: 16px; color: #333;">Dear <strong>${adopter.firstName}</strong>,</p>
        <p style="font-size: 16px; color: #333;">We are thrilled to inform you that you've successfully booked <strong>${bookedPet.name}</strong> for adoption. Your request has been sent to the admin for approval. Once the admin approves your request, the adoption process will proceed.</p>
        <p style="font-size: 16px; color: #333;">Thank you for choosing to give a pet a loving home!</p>
      </div>
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://yourwebsite.com" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">View Your Bookings</a>
      </div>
      <div style="margin-top: 40px; text-align: center; font-size: 14px; color: #999;">
        <p>&copy; 2024 Pet Adoption Platform. All rights reserved.</p>
      </div>
    </div>
  </body>`
    );
  }

  // Create the booking request (pending approval from admin)
  await prisma.adoption.create({
    data: {
      petId: bookedPet.id,
      adopterId: adopter.id,
    },
  });

  return petBookedIntoDB;
};

const getAllMyAdopterPet = async (id: string) => {
  const adopter = await prisma.adopter.findFirstOrThrow({
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

  const myAdoptPet = await prisma.adoption.findMany({
    where: {
      adopterId: adopter.id,
    },
  });
  return myAdoptPet;
};

export const AdopterService = {
  getAllAdopterFromDB,
  getSingleAdopterById,
  updateAdopterIntoDB,
  deleteAdopterFromDB,
  softDeleteAdopterFromDB,
  petBookedIntoDB,
  getAllMyAdopterPet,
};
