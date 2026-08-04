import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address.").trim().toLowerCase(),
  password: z
    .string()
    .min(1, "Password is required.")
    .max(128, "Password cannot exceed 128 characters."),
});
