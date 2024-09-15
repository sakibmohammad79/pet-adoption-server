import prisma from "../../../helpers/prisma";
const getAllAdminFromDB = async (params: any) => {
  // console.log(params);
  const result = await prisma.admin.findMany({
    where: {
      OR: [
        {
          email: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        },
        {
          name: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    },
  });
  return result;
};

export const AdminServices = {
  getAllAdminFromDB,
};
