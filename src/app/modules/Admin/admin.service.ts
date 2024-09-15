import prisma from "../../../helpers/prisma";
const getAllAdminFromDB = async () => {
  const result = await prisma.admin.findMany();
  return result;
};

export const AdminServices = {
  getAllAdminFromDB,
};
