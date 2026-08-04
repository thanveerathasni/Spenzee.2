import { z } from "zod";

export const resetPasswordSchema = z.object({
  email: z.email("Invalid email address.").trim().toLowerCase(),
  token: z.string().trim().min(1, "Reset token is required."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password cannot exceed 128 characters.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}\-_=+|\\:;"'<>,./~`]).+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    ),
});
