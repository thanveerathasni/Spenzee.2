import { z } from "zod";

import { strongPasswordSchema } from "./password.schema";

export const resetPasswordSchema = z.object({
  email: z.email("Invalid email address.").trim().toLowerCase(),
  token: z.string().trim().min(1, "Reset token is required."),
  password: strongPasswordSchema,
});
