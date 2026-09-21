import { z } from "zod";

import { strongPasswordSchema } from "./password.schema";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
    message: "New password and confirm password must match.",
    path: ["confirmPassword"],
  });
