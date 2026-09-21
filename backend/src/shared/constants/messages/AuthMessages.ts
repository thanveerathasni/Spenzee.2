export const AUTH_MESSAGES = {
  OTP_SENT: "OTP sent successfully.",
  OTP_VERIFIED: "OTP verified successfully. User registered.",
  INVALID_OTP: "Invalid OTP.",
  OTP_EXPIRED: "OTP has expired.",
  USER_ALREADY_EXISTS: "User already exists.",
  EMAIL_ALREADY_REGISTERED: "Email is already registered.",
  REGISTRATION_SUCCESS: "User registered successfully.",
  PASSWORD_RESET_REQUEST_ACCEPTED:
    "If an account exists for this email, a password reset link has been sent.",
} as const;
