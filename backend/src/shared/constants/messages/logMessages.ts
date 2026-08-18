export const LOG_MESSAGES = {
  SERVER_STARTED: "Server started successfully.",

  DATABASE_CONNECTED: "Database connected successfully.",

  DATABASE_CONNECTION_FAILED: "Database connection failed.",

  USER_REGISTERED: "User registered.",

  USER_LOGGED_IN: "User logged in.",
LOGGED_OUT: "User logged out.",
  LOGIN_FAILED: "Login failed.",

  LOGIN_INVALID_PASSWORD: "Login failed: invalid password.",

  LOGIN_USER_NOT_FOUND: "Login failed: user not found.",

  TOKEN_EXPIRED: "JWT verification failed: token expired.",

  INVALID_TOKEN: "JWT verification failed: invalid token.",

  AUTH_TOKEN_MISSING: "Authentication failed: token missing.",

  REFRESH_TOKEN_FAILED: "Refresh token authentication failed.",

  REFRESH_TOKEN_ROTATED: "Refresh token rotated successfully.",

  LOGOUT_FAILED: "Logout failed.",

  PASSWORD_RESET_REQUESTED: "Password reset requested.",

  PASSWORD_RESET_FAILED: "Password reset request failed.",

  PASSWORD_RESET_COMPLETED: "Password reset completed.",

  PASSWORD_CHANGE_FAILED: "Password change failed.",

  PASSWORD_CHANGED: "Password changed successfully.",

  OTP_SENT: "Registration OTP sent.",

  OTP_VERIFICATION_FAILED: "OTP verification failed.",

  OTP_VERIFIED: "OTP verified successfully.",

  OTP_GENERATED: "OTP generated successfully.",

  OTP_EXPIRED: "OTP has expired.",

  OTP_NOT_FOUND: "OTP not found.",

  OTP_ALREADY_USED: "OTP has already been used.",

  OTP_INVALID: "Invalid OTP.",

  OTP_RESENT: "OTP resent successfully.",

  OTP_RESEND_FAILED: "Failed to resend OTP.",

  OTP_ALREADY_EXISTS: "OTP already exists for this email.",

  OTP_NOT_SENT: "Failed to send OTP email.",

  OTP_EMAIL_TEMPLATE_ERROR: "Error in OTP email template.",

  OTP_EMAIL_SEND_ERROR: "Error sending OTP email.",

  OTP_EMAIL_SENT: "OTP email sent successfully.",

  OTP_EMAIL_NOT_FOUND: "OTP email not found.",

  OTP_EMAIL_INVALID: "Invalid OTP email.",

  OTP_EMAIL_EXPIRED: "OTP email has expired.",

  OTP_EMAIL_ALREADY_USED: "OTP email has already been used.",

  OTP_EMAIL_RESENT: "OTP email resent successfully.",

  OTP_EMAIL_RESEND_FAILED: "Failed to resend OTP email.",

  OTP_EMAIL_ALREADY_EXISTS: "OTP email already exists for this email.",
} as const;
