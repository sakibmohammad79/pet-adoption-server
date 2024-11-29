import { Admin, PetAdoptStatus, Prisma, UserStatus } from "@prisma/client";

import { adminSearchableFields } from "./admin.constant";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import prisma from "../../../shared/prisma";
import { IAdminFilterRequest } from "./admin.interface";
import { IPaginationOptions } from "../../../interface/pagination";
import ApiError from "../../error/ApiError";
import { StatusCodes } from "http-status-codes";
import { checkIsDeleted } from "../../../helpers/checkIsDeleted";
import emailSender from "../Auth/emialSender";

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
  const pet = await prisma.pet.findUnique({
    where: {
      id,
      isPublished: true,
    },
  });

  if (pet) {
    throw new ApiError(StatusCodes.CONFLICT, "This pet already published!");
  }

  const publishedPet = await prisma.pet.update({
    where: {
      id,
      isPublished: false,
    },
    data: {
      isPublished: true,
    },
  });

  const publisher = await prisma.publisher.findFirstOrThrow({
    where: {
      id: publishedPet.publisherId,
    },
  });

  if (publishedPet.isPublished) {
    await emailSender(
      publisher.email,
      "Pet Published ✔",
      `<body style="font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; padding-bottom: 20px;">
      <h2 style="color: #4CAF50; font-size: 24px; margin: 0;">Congratulations!</h2>
      <p style="font-size: 16px; color: #555;">Your pet has been successfully published on our platform.</p>
    </div>
    <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
      <p style="font-size: 16px; color: #333;">Dear <strong>Publisher</strong>,</p>
      <p style="font-size: 16px; color: #333;">We are excited to inform you that your pet, <strong>${publishedPet.name}</strong>, has been successfully published on our platform. Potential adopters will now be able to view your pet and consider adopting them.</p>
      <p style="font-size: 16px; color: #333;">Thank you for being a part of our community and helping pets find loving homes!</p>
    </div>
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://yourwebsite.com" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">View Your Published Pets</a>
    </div>
    <div style="margin-top: 40px; text-align: center; font-size: 14px; color: #999;">
      <p>&copy; 2024 Pet Adoption Platform. All rights reserved.</p>
    </div>
  </div>
</body>`
    );
  }
  return publishedPet;
};

const petUnpublishIntoDB = async (id: string, user: any) => {
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
      isBooked: false,
      isAdopt: false,
      isPublished: true,
      isDeleted: false,
    },
  });
  const unpublishedPet = await prisma.pet.update({
    where: {
      id: pet.id,
    },
    data: {
      isPublished: false,
    },
  });

  const publisher = await prisma.publisher.findFirstOrThrow({
    where: {
      id: unpublishedPet.publisherId,
    },
  });

  if (!unpublishedPet.isPublished) {
    await emailSender(
      publisher.email,
      "Pet Unpublished",
      `<body style="font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding-bottom: 20px;">
          <h2 style="color: #FF4C4C; font-size: 24px; margin: 0;">Important Notice!</h2>
          <p style="font-size: 16px; color: #555;">Your pet listing has been unpublished.</p>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <p style="font-size: 16px; color: #333;">Dear <strong>Publisher</strong>,</p>
          <p style="font-size: 16px; color: #333;">We wanted to inform you that your pet, <strong>${unpublishedPet.name}</strong>, has been unpublished from our platform. This means that it will no longer be visible to potential adopters.</p>
          <p style="font-size: 16px; color: #333;">If you have any questions or would like to republish your pet, please feel free to contact us or visit your dashboard.</p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://yourwebsite.com" style="display: inline-block; padding: 10px 20px; background-color: #FF4C4C; color: #fff; text-decoration: none; border-radius: 5px;">View Your Dashboard</a>
        </div>
        <div style="margin-top: 40px; text-align: center; font-size: 14px; color: #999;">
          <p>&copy; 2024 Pet Adoption Platform. All rights reserved.</p>
        </div>
      </div>
    </body>`
    );
  }
  return unpublishedPet;
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

  const adopter = await prisma.adopter.findUniqueOrThrow({
    where: {
      id: updateAdoption.adopterId,
    },
  });

  if (updateAdoption.adoptionStatus === PetAdoptStatus.APPROVED) {
    // Mark the pet as adopted and update the adoption status
    const updatedPet = await prisma.pet.update({
      where: { id: adoption.petId },
      data: { isAdopt: true, isBooked: false, isPublished: false }, // Mark as adopted, unpublish from homepage
    });
    if (updatedPet.isAdopt) {
      await emailSender(
        adopter?.email,
        "Adoption Approved",
        `<body style="font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; padding-bottom: 20px;">
        <h2 style="color: #4CAF50; font-size: 24px; margin: 0;">Adoption Approved!</h2>
        <p style="font-size: 16px; color: #555;">Your adoption request has been approved!</p>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
        <p style="font-size: 16px; color: #333;">Dear <strong>${adopter.firstName}</strong>,</p>
        <p style="font-size: 16px; color: #333;">We are delighted to inform you that your adoption request for <strong>${updatedPet.name}</strong> has been approved by our admin. Congratulations on your new furry friend!</p>
        <p style="font-size: 16px; color: #333;">You can now access <strong>${updatedPet.name}</strong>'s details in your profile and begin the next steps for adoption.</p>
        <p style="font-size: 16px; color: #333;">Thank you for giving <strong>${updatedPet.name}</strong> a loving home!</p>
      </div>
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://yourwebsite.com" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px;">View Your Pet Profile</a>
      </div>
      <div style="margin-top: 40px; text-align: center; font-size: 14px; color: #999;">
        <p>&copy; 2024 Pet Adoption Platform. All rights reserved.</p>
      </div>
    </div>
  </body>`
      );
    }
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
    data: { adoptionStatus: PetAdoptStatus.REJECTED },
  });

  if (updateAdoption.adoptionStatus === PetAdoptStatus.REJECTED) {
    //delete adoption request
    await prisma.adoption.delete({
      where: {
        id: adoptionId,
      },
    });
    // Mark the pet as adopted and update the adoption status
    await prisma.pet.update({
      where: { id: adoption.petId },
      data: { isAdopt: false, isBooked: false, isPublished: true }, // Mark as adopted, unpublish from homepage
    });
  }

  return updateAdoption;
};

const getAllAdoptionRequest = async (user: any) => {
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
  petUnpublishIntoDB,
  approveAdoption,
  rejectAdoption,
  getAllAdoptionRequest,
};
