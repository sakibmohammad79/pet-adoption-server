import { Admin, Publisher, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { imageUploader } from "../../../helpers/imageUploader";
import { IFile } from "../../../interface/file";
import { Request } from "express";

const createAdminIntoDB = async (req: Request): Promise<Admin> => {
  const file = req.file as IFile;

  if (file) {
    const uploadToCloundinary = await imageUploader.imageUploadToCloudinary(
      file
    );
    req.body.admin.profilePhoto = uploadToCloundinary?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: {
        password: hashedPassword,
        email: req.body.admin.email,
        role: UserRole.ADMIN,
      },
    });

    const createdAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });

    return createdAdminData;
  });

  return result;
};
const createPetPublisherIntoDB = async (req: Request): Promise<Publisher> => {
  const file = req.file as IFile;

  if (file) {
    const uploadToCloundinary = await imageUploader.imageUploadToCloudinary(
      file
    );
    req.body.publisher.profilePhoto = uploadToCloundinary?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: {
        password: hashedPassword,
        email: req.body.publisher.email,
        role: UserRole.PET_PUBLISHER,
      },
    });

    const createdPetPublisherData = await transactionClient.publisher.create({
      data: req.body.publisher,
    });

    return createdPetPublisherData;
  });

  return result;
};

export const UserServices = {
  createAdminIntoDB,
  createPetPublisherIntoDB,
};
