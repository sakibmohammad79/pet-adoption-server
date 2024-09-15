import { UserRole } from "@prisma/client";
import prisma from "../../../helpers/prisma";
import { IAdminPayload } from "../../../types/user";
import bcrypt from "bcrypt";

const createAdminIntoDB = async (payload: IAdminPayload) => {
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
        name: payload.admin.name,
        email: payload.admin.email,
        contactNumber: payload.admin.contactNumber,
        address: payload.admin.address ?? "",
      },
    });

    return createdAdminData;
  });

  return result;
};

export const UserServices = {
  createAdminIntoDB,
};
