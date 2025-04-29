import { z } from "zod";

const createContactontactMessageValidationSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required").max(100),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required").max(1000),
    })
})

export const ContactMessageValidation = {
    createContactontactMessageValidationSchema
}