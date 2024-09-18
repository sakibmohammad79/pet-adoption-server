import { Gender, UserRole } from "@prisma/client";

import { IAdminPayload } from "../../../interface/user";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";

const createAdminIntoDB = async (payload: IAdminPayload) => {
  console.log(payload);
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: {
        password: hashedPassword,
        email: payload.admin.email,
        role: UserRole.ADMIN,
      },
    });

    const createdAdminData = await transactionClient.admin.create({
      data: {
        firstName: payload.admin.firstName,
        lastName: payload.admin.lastName,
        email: payload.admin.email,
        contactNumber: payload.admin.contactNumber,
        address: payload.admin.address,
        gender: payload.admin.gender,
        birthDate: payload.admin.birthDate,
        profilePhoto: payload.admin.profilePhoto,
      },
    });

    return createdAdminData;
  });

  return result;
};

export const UserServices = {
  createAdminIntoDB,
};
