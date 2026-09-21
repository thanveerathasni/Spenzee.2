export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY_OTP: "/auth/verify-otp",
    RESEND_OTP: "/auth/resend-otp",
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  USER: {
    ME: "/users/me",
  },
} as const;

export const AUTH_ROUTES = API_ROUTES.AUTH;
export const USER_ROUTES = API_ROUTES.USER;
