import { z } from "zod";

const updatePublisherValidationSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .min(1, { message: "First name is required!" })
      .optional(),
    lastName: z
      .string()
      .min(1, { message: "Last name is required!" })
      .optional(),
    profilePhoto: z.string().url({ message: "Invalid URL format." }).optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
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
    contactNumber: z
      .string()
      .min(11, { message: "Contact number must be at least 11 digits." })
      .max(15, { message: "Contact number can't exceed 15 digits." })
      .optional(),
    address: z.string().optional(),
  }),
});

export const publisherValidationSchema = {
  updatePublisherValidationSchema,
};
