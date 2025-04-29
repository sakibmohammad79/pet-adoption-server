import prisma from "../../../shared/prisma"

const createContactMessgeIntoDB = async(payload: any) => {

 const result = await prisma.contactMessage.create({
    data: payload
 });
 return result;
}
const getAllContactMessgeFromDB = async() => {
 const result = await prisma.contactMessage.findMany();
 return result;
}

export const ContactMessageService = {
    createContactMessgeIntoDB,
    getAllContactMessgeFromDB,
}