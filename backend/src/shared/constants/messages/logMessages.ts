export const LOG_MESSAGES = {
  SERVER_STARTED: "Server started successfully.",

  DATABASE_CONNECTED: "Database connected successfully.",

  DATABASE_CONNECTION_FAILED: "Database connection failed.",

  USER_REGISTERED: "User registered.",

  USER_LOGGED_IN: "User logged in.",

  LOGIN_FAILED: "Login failed.",

  LOGIN_INVALID_PASSWORD: "Login failed: invalid password.",

  LOGIN_USER_NOT_FOUND: "Login failed: user not found.",

  TOKEN_EXPIRED: "JWT verification failed: token expired.",

  INVALID_TOKEN: "JWT verification failed: invalid token.",

  USER_LOGGED_OUT: "User logged out.",
} as const;
