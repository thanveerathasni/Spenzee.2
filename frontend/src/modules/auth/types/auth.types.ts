import type { AuthSession } from "@/shared/types";

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
