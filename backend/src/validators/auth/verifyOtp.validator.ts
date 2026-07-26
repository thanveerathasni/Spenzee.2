import { z } from "zod";

export const verifyOtpSchema = z.object({
    email: z
        .email("Invalid email address.")
        .trim()
        .toLowerCase(),

    otp: z
        .string()
        .trim()
        .length(6, "OTP must be exactly 6 digits.")
        .regex(/^\d+$/, "OTP must contain only digits."),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;