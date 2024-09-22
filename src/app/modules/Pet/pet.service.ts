import { Pet } from "@prisma/client";
import { IPet } from "./pet.interface";
import prisma from "../../../shared/prisma";

const createPetIntoDB = async (data: IPet): Promise<Pet | null> => {
  const result = await prisma.pet.create({
    data: data,
  });
  return result;
};

export const PetService = {
  createPetIntoDB,
};
