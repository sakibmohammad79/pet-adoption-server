import { z } from "zod";
import { Gender, HealthStatus, PetAdoptStatus, PetSize } from "@prisma/client";

export const createPetSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required!" }),
    species: z.enum(["DOG", "CAT", "RABBIT", "BIRD"], {
      message: "Species must be one of Dog, Cat, Rabbit, or Bird!",
    }),
    image: z.string().url({ message: "Image URL must be a valid URL!" }),
    birthDate: z.preprocess((arg) => {
      if (typeof arg === "string") {
        const date = new Date(arg); // Validate if the string is a valid ISO date
        if (!isNaN(date.getTime()) && date.toISOString().startsWith(arg)) {
          return date;
        }
        throw new Error("Invalid date format");
      } // If not a string, return the value as-is (must be a Date object or undefined)
      return arg;
    }, z.date().optional()),
    description: z.string().optional(),
    gender: z.nativeEnum(Gender, { message: "Gender is required!" }),
    age: z.number().min(0, { message: "Age must be a positive number!" }),
    breed: z.string().min(1, { message: "Breed is required!" }),
    weight: z.number().min(0, { message: "Weight must be a positive number!" }),
    height: z.number().min(0, { message: "Height must be a positive number!" }),
    color: z.string().min(1, { message: "Color is required!" }),
    size: z.nativeEnum(PetSize, { message: "Pet size is required!" }),
    healthStatus: z.nativeEnum(HealthStatus, {
      message: "Health status is required!",
    }),
    specialNeeds: z.string().optional(),
    location: z.string().optional(),
    publisherId: z.string().min(1, { message: "Publisher ID is required!" }),
  }),
});

const updatePetSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    species: z
      .enum(["DOG", "CAT", "RABBIT", "BIRD"], {
        message: "Species must be one of DOG, CAT, RABBIT, or BIRD!",
      })
      .optional(),
    image: z.string().optional(),
    birthDate: z.preprocess((arg) => {
      if (typeof arg === "string") {
        const date = new Date(arg);
        if (!isNaN(date.getTime()) && date.toISOString().startsWith(arg)) {
          return date;
        }
        throw new Error("Invalid date format");
      }
      return arg;
    }, z.date().optional()),
    description: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE"]).optional(),
    age: z
      .number()
      .min(0, { message: "Age must be a positive number!" })
      .optional(),
    breed: z.string().optional(),
    weight: z
      .number()
      .min(0, { message: "Weight must be a positive number!" })
      .optional(),
    height: z
      .number()
      .min(0, { message: "Height must be a positive number!" })
      .optional(),
    color: z.string().optional(),
    size: z.nativeEnum(PetSize).optional(), // Assuming PetSize is an enum from Prisma
    healthStatus: z.nativeEnum(HealthStatus).optional(), // Assuming HealthStatus is an enum from Prisma
    specialNeeds: z.string().optional(),
    published: z.boolean().optional(),
    location: z.string().optional(),
    isAdopt: z.boolean().optional(),
    isBooked: z.boolean().optional(),
  }),
});

export { updatePetSchema };

export const petValidationSchema = {
  createPetSchema,
  updatePetSchema,
};
