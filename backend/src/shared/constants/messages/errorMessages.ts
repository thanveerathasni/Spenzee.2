export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Internal server error.",

  INVALID_CREDENTIALS: "Invalid email or password.",

  UNAUTHORIZED: "Unauthorized access.",

  AUTH_TOKEN_MISSING: "Authentication token is required.",

  INVALID_AUTH_HEADER: "Authorization header must use the Bearer token format.",

  TOKEN_EXPIRED: "Token has expired.",

  INVALID_TOKEN: "Invalid token.",

  FORBIDDEN: "Access denied.",

  USER_NOT_FOUND: "User not found.",

  USER_ACCOUNT_DELETED: "This account has been deleted.",

  USER_ACCOUNT_INACTIVE: "This account is inactive.",

  EMAIL_ALREADY_EXISTS: "Email already exists.",

  VALIDATION_FAILED: "Validation failed.",

  RESOURCE_NOT_FOUND: "Requested resource not found.",
} as const;
