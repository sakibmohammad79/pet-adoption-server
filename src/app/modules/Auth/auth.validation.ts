import z from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    password: z.string().min(1, "Password must be at least 6 characters long."),
    email: z.string().email({ message: "Invalid email formate!" }),
  }),
});

export const AuthValidationSchema = {
  loginValidationSchema,
};
