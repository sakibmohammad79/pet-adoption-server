import { Gender, UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

const createAdminValidationSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
  admin: z.object({
    firstName: z.string().min(1, { message: "First name is required!" }),
    lastName: z.string().min(1, { message: "Last name is required!" }),
    email: z.string().email({ message: "Invalid email formate!" }),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional(),
    birthDate: z.preprocess((arg) => {
      if (typeof arg === "string") {
        const date = new Date(arg);

        // Validate if the string is a valid ISO date
        if (!isNaN(date.getTime()) && date.toISOString().startsWith(arg)) {
          return date;
        }
        throw new Error("Invalid date format");
      }
      // If not a string, return the value as-is (must be a Date object or undefined)
      return arg;
    }, z.date().optional()),
    profilePhoto: z.string().url({ message: "Invalid URL format." }).optional(),
    contactNumber: z
      .string()
      .min(11, { message: "Contact number must be at least 11 digits." })
      .max(15, { message: "Contact number can't exceed 15 digits." })
      .optional(),
    address: z.string().optional(),
  }),
});

const createPetPublisherValidationSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
  publisher: z.object({
    firstName: z.string().min(1, { message: "First name is required!" }),
    lastName: z.string().min(1, { message: "Last name is required!" }),
    email: z.string().email({ message: "Invalid email formate!" }),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional(),
    birthDate: z.preprocess((arg) => {
      if (typeof arg === "string") {
        const date = new Date(arg);

        // Validate if the string is a valid ISO date
        if (!isNaN(date.getTime()) && date.toISOString().startsWith(arg)) {
          return date;
        }
        throw new Error("Invalid date format");
      }
      // If not a string, return the value as-is (must be a Date object or undefined)
      return arg;
    }, z.date().optional()),
    profilePhoto: z.string().url({ message: "Invalid URL format." }).optional(),
    contactNumber: z
      .string()
      .min(11, { message: "Contact number must be at least 11 digits." })
      .max(15, { message: "Contact number can't exceed 15 digits." }),
    address: z.string().optional(),
  }),
});
const createPetAdopterValidationSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
  adopter: z.object({
    firstName: z.string().min(1, { message: "First name is required!" }),
    lastName: z.string().min(1, { message: "Last name is required!" }),
    email: z.string().email({ message: "Invalid email formate!" }),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional(),
    birthDate: z.preprocess((arg) => {
      if (typeof arg === "string") {
        const date = new Date(arg);

        // Validate if the string is a valid ISO date
        if (!isNaN(date.getTime()) && date.toISOString().startsWith(arg)) {
          return date;
        }
        throw new Error("Invalid date format");
      }
      // If not a string, return the value as-is (must be a Date object or undefined)
      return arg;
    }, z.date().optional()),
    profilePhoto: z.string().url({ message: "Invalid URL format." }).optional(),
    contactNumber: z
      .string()
      .min(11, { message: "Contact number must be at least 11 digits." })
      .max(15, { message: "Contact number can't exceed 15 digits." }),
    address: z.string().optional(),
  }),
});

const changeUserStatusSchema = z.object({
  body: z.object({
    status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED]),
  }),
});

export const UserValidationSchema = {
  createAdminValidationSchema,
  createPetPublisherValidationSchema,
  createPetAdopterValidationSchema,
  changeUserStatusSchema,
};
