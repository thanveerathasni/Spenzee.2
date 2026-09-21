import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResendOtpRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
} from "../types/auth.types";
import type { ApiResponse, AuthSession } from "@/shared/types";

import { apiClient } from "@/shared/api";
import { AUTH_ROUTES } from "@/shared/constants";


async function getData<T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const response = await request;

  if (!response.data.data) {
    throw new Error("The API response did not contain data.");
  }

  return response.data.data;
}

async function postVoid(request: Promise<unknown>): Promise<void> {
  await request;
}

export const authService = {
  login: (payload: LoginRequest): Promise<AuthSession> =>
    getData(apiClient.post<ApiResponse<AuthSession>>(AUTH_ROUTES.LOGIN, payload)),

  register: (payload: RegisterRequest): Promise<void> =>
    postVoid(apiClient.post<ApiResponse<void>>(AUTH_ROUTES.REGISTER, payload)),

  verifyOtp: (payload: VerifyOtpRequest): Promise<void> =>
    postVoid(apiClient.post<ApiResponse<void>>(AUTH_ROUTES.VERIFY_OTP, payload)),

  resendOtp: (payload: ResendOtpRequest): Promise<void> =>
    postVoid(apiClient.post<ApiResponse<void>>(AUTH_ROUTES.RESEND_OTP, payload)),

  logout: (refreshToken: string): Promise<void> =>
    postVoid(apiClient.post<ApiResponse<void>>(AUTH_ROUTES.LOGOUT, { refreshToken })),

  requestPasswordReset: (payload: ForgotPasswordRequest): Promise<void> =>
    postVoid(apiClient.post<ApiResponse<void>>(AUTH_ROUTES.FORGOT_PASSWORD, payload)),

  resetPassword: (payload: ResetPasswordRequest): Promise<void> =>
    postVoid(apiClient.post<ApiResponse<void>>(AUTH_ROUTES.RESET_PASSWORD, payload)),

  changePassword: (payload: ChangePasswordRequest): Promise<void> =>
    postVoid(apiClient.post<ApiResponse<void>>(AUTH_ROUTES.CHANGE_PASSWORD, payload)),
};
