export const TYPES = {
  Logger: Symbol.for("Logger"),

  // auth  types

  AuthRepository: Symbol.for("AuthRepository"),

  AuthService: Symbol.for("AuthService"),

  // Repositories
  UserRepository: Symbol.for("UserRepository"),
  PendingRegistrationRepository: Symbol.for("PendingRegistrationRepository"),
  OtpRepository: Symbol.for("OtpRepository"),
  RefreshTokenRepository: Symbol.for("RefreshTokenRepository"),

  // Services
  PasswordService: Symbol.for("PasswordService"),
  OtpService: Symbol.for("OtpService"),
  EmailService: Symbol.for("EmailService"),
  RegisterUserService: Symbol.for("RegisterUserService"),
  UserService: Symbol.for("UserService"),
  VerifyOtpService: Symbol.for("VerifyOtpService"),
  JwtService: Symbol.for("JwtService"),
  LoginService: Symbol.for("LoginService"),
  RefreshTokenService: Symbol.for("RefreshTokenService"),
  LogoutService: Symbol.for("LogoutService"),
  AuthMiddleware: Symbol.for("AuthMiddleware"),
  // Controllers
  UserController: Symbol.for("UserController"),
  AuthController: Symbol.for("AuthController"),
} as const;
