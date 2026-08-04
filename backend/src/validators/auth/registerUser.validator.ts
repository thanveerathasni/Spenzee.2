import { z } from "zod";

import { strongPasswordSchema } from "./password.schema";

export const registerUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters.")
    .max(50, "First name cannot exceed 50 characters."),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters.")
    .max(50, "Last name cannot exceed 50 characters."),

  email: z.email("Invalid email address.").trim().toLowerCase(),

  password: strongPasswordSchema,
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
