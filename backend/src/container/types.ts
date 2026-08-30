export const TYPES = {
  Logger: Symbol.for("Logger"),

  // Auth

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
ProviderPasswordSetupTokenRepository: Symbol.for(
  "ProviderPasswordSetupTokenRepository",
),
ProviderResetPasswordTokenRepository: Symbol.for(
  "ProviderResetPasswordTokenRepository",
),

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
ProviderPasswordSetupService: Symbol.for("ProviderPasswordSetupService"),
ProviderLoginService: Symbol.for("ProviderLoginService"),
  ProviderForgotPasswordService: Symbol.for("ProviderForgotPasswordService"),
  ProviderResetPasswordService: Symbol.for("ProviderResetPasswordService"),

  // Middleware
  AuthMiddleware: Symbol.for("AuthMiddleware"),
  AdminAuthMiddleware: Symbol.for("AdminAuthMiddleware"),
  // Controllers
  UserController: Symbol.for("UserController"),
  AuthController: Symbol.for("AuthController"),
  ProviderLoginController: Symbol.for("ProviderLoginController"),


  ProviderController: Symbol.for("ProviderController"),
  ProviderPasswordSetupController: Symbol.for("ProviderPasswordSetupController"),
  ProviderForgotPasswordController: Symbol.for("ProviderForgotPasswordController"),
  ProviderResetPasswordController: Symbol.for("ProviderResetPasswordController"),

  AdminController: Symbol.for("AdminController"),

} as const;
