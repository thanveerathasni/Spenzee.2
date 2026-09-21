import { z } from "zod";

/* =========================================================
   SHARED SCHEMAS
   ========================================================= */

const emailSchema = z
  .string()
  .min(1, "Email is required.")
  .email("Enter a valid email address.")
  .trim()
  .toLowerCase();

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password cannot exceed 128 characters.")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
  .regex(/[0-9]/, "Must contain at least one number.");

/* =========================================================
   LOGIN SCHEMA
   ========================================================= */

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/* =========================================================
   REGISTER SCHEMA
   ========================================================= */

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required.")
      .max(50, "First name cannot exceed 50 characters.")
      .trim(),
    lastName: z
      .string()
      .min(1, "Last name is required.")
      .max(50, "Last name cannot exceed 50 characters.")
      .trim(),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

/* =========================================================
   OTP SCHEMA
   ========================================================= */

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits.")
    .regex(/^\d{6}$/, "OTP must contain only digits."),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

/* =========================================================
   FORGOT PASSWORD SCHEMA
   ========================================================= */

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/* =========================================================
   RESET PASSWORD SCHEMA
   ========================================================= */

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

/* =========================================================
   CHANGE PASSWORD SCHEMA
   ========================================================= */

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
