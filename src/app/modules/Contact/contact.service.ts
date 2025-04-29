import prisma from "../../../shared/prisma"

const createContactMessgaeIntoDB = async(payload: any) => {

 const result = await prisma.contactMessage.create({
    data: payload
 });
 return result;
}

export const ContactMessageService = {
    createContactMessgaeIntoDB,
}