import type { AuthSession } from "@/shared/types";

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = AuthSession;

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
