export const TYPES = {
  Logger: Symbol.for("Logger"),

  // Auth
  AuthRepository: Symbol.for("AuthRepository"),
  AuthService: Symbol.for("AuthService"),

  // Repositories
  UserRepository: Symbol.for("UserRepository"),
  PendingRegistrationRepository: Symbol.for("PendingRegistrationRepository"),
  OtpRepository: Symbol.for("OtpRepository"),
  RefreshTokenRepository: Symbol.for("RefreshTokenRepository"),
  ResetPasswordTokenRepository: Symbol.for("ResetPasswordTokenRepository"),

  // Admin
  AdminRepository: Symbol.for("AdminRepository"),

  // Provider
  ProviderRepository: Symbol.for("ProviderRepository"),

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
  ForgotPasswordService: Symbol.for("ForgotPasswordService"),
  ResetPasswordService: Symbol.for("ResetPasswordService"),
  ChangePasswordService: Symbol.for("ChangePasswordService"),

  // Admin Services
  AdminSeedService: Symbol.for("AdminSeedService"),
  AdminLoginService: Symbol.for("AdminLoginService"),
  AdminProviderService: Symbol.for("AdminProviderService"),

  // Provider Services
  ApplyProviderService: Symbol.for("ApplyProviderService"),

  // Middleware
  AuthMiddleware: Symbol.for("AuthMiddleware"),
  AdminAuthMiddleware: Symbol.for("AdminAuthMiddleware"),
  // Controllers
  UserController: Symbol.for("UserController"),
  AuthController: Symbol.for("AuthController"),
  ProviderController: Symbol.for("ProviderController"),
  AdminController: Symbol.for("AdminController"),
} as const;
