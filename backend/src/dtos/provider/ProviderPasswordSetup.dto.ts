import { z } from "zod";

export const providerPasswordSetupSchema = z.object({
  providerId: z.string().min(1, "Provider ID is required"),
  token: z.string().min(1, "Setup token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type ProviderPasswordSetupDto = z.infer<
  typeof providerPasswordSetupSchema
>;
