export const SUCCESS_MESSAGES = {
  CREATED: "Resource created successfully.",
  UPDATED: "Resource updated successfully.",
  DELETED: "Resource deleted successfully.",
  FETCHED: "Resource fetched successfully.",
} as const;

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Login successful.",
  LOGOUT_SUCCESS: "Logout successful.",
  REGISTER_SUCCESS: "Registration successful.",

  INVALID_CREDENTIALS: "Invalid email or password.",
  UNAUTHORIZED: "Unauthorized access.",
  TOKEN_EXPIRED: "Token has expired.",
} as const;

export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Something went wrong.",
  NOT_FOUND: "Requested resource not found.",
  VALIDATION_FAILED: "Validation failed.",
} as const;