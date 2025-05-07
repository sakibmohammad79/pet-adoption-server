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

const deleteMessageFromDB = async (id: string) => {
    const result = await prisma.contactMessage.delete({
        where: {
            id
        }
    })
}

export const ContactMessageService = {
    createContactMessgeIntoDB,
    getAllContactMessgeFromDB,
    deleteMessageFromDB
}