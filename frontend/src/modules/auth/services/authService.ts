import { apiClient } from "@/shared/api";
import { AUTH_ROUTES } from "@/shared/constants";
import type { ApiResponse, AuthSession } from "@/shared/types";

import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
} from "../types/auth.types";

async function getData<T>(request: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const response = await request;

  if (!response.data.data) {
    throw new Error("The API response did not contain data.");
  }

  return response.data.data;
}

export const authService = {
  login: (payload: LoginRequest): Promise<AuthSession> =>
    getData(apiClient.post<ApiResponse<AuthSession>>(AUTH_ROUTES.LOGIN, payload)),

  logout: (refreshToken: string): Promise<void> =>
    apiClient.post<ApiResponse<void>>(AUTH_ROUTES.LOGOUT, { refreshToken }).then(() => undefined),

  requestPasswordReset: (payload: ForgotPasswordRequest): Promise<void> =>
    apiClient.post<ApiResponse<void>>(AUTH_ROUTES.FORGOT_PASSWORD, payload).then(() => undefined),

  resetPassword: (payload: ResetPasswordRequest): Promise<void> =>
    apiClient.post<ApiResponse<void>>(AUTH_ROUTES.RESET_PASSWORD, payload).then(() => undefined),

  changePassword: (payload: ChangePasswordRequest): Promise<void> =>
    apiClient.post<ApiResponse<void>>(AUTH_ROUTES.CHANGE_PASSWORD, payload).then(() => undefined),
};
