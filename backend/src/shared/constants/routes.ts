export const AUTH_ROUTES = {
  REGISTER: "/register",
  VERIFY_OTP: "/verify-otp",
  LOGIN: "/login",
  REFRESH_TOKEN: "/refresh-token",
  LOGOUT: "/logout",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  CHANGE_PASSWORD: "/change-password",
} as const;

export const PROVIDER_ROUTES = {
  APPLY: "/apply",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  SETUP_PASSWORD: "/setup-password",
} as const;

export const ADMIN_ROUTES = {
  LOGIN: "/login",
  PENDING_PROVIDERS: "/providers/pending",
  APPROVE_PROVIDER: "/providers/:id/approve",
  REJECT_PROVIDER: "/providers/:id/reject",
} as const;

export const USER_ROUTES = {
  CREATE: "/",
  GET_BY_ID: "/:id",
} as const;
