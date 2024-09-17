import { z } from "zod";

const createAdminValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." }),
    admin: z.object({
      name: z.string().min(1, { message: "Name is required!" }),
      email: z.string().email({ message: "Invalid email formate!" }),
      profilePhoto: z
        .string()
        .url({ message: "Invalid URL format." })
        .optional(),
      contactNumber: z
        .string()
        .min(11, { message: "Contact number must be at least 11 digits." })
        .max(15, { message: "Contact number can't exceed 15 digits." }),
      address: z.string().optional(),
    }),
  }),
});

export const UserValidationSchema = {
  createAdminValidationSchema,
};
