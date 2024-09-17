import { z } from "zod";

const updateAdminValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required!" }).optional(),
    profilePhoto: z.string().url({ message: "Invalid URL format." }).optional(),
    contactNumber: z
      .string()
      .min(11, { message: "Contact number must be at least 11 digits." })
      .max(15, { message: "Contact number can't exceed 15 digits." })
      .optional(),
    address: z.string().optional(),
  }),
});

export const AdminValidationSchema = {
  updateAdminValidationSchema,
};
