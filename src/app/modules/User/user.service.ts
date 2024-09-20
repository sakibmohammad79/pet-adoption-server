import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { imageUploader } from "../../../helpers/imageUploader";
import { IFile } from "../../../interface/file";

const createAdminIntoDB = async (req: any) => {
  const file: IFile = req.file;

  if (file) {
    const uploadToCloundinary = await imageUploader.imageUploadToCloudinary(
      file
    );
    //console.log(uploadToCloundinary.secure_url);
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

export const UserServices = {
  createAdminIntoDB,
};
