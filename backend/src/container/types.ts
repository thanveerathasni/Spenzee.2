export const TYPES = {
  Logger: Symbol.for("Logger"),



// auth  types 

AuthRepository : Symbol.for("AuthRepository"),

AuthService: Symbol.for("AuthService"),




    // Repositories
    UserRepository: Symbol.for("UserRepository"),
    PendingRegistrationRepository: Symbol.for("PendingRegistrationRepository"),
    OtpRepository: Symbol.for("OtpRepository"),

    // Services
    PasswordService: Symbol.for("PasswordService"),
    OtpService: Symbol.for("OtpService"),
    EmailService: Symbol.for("EmailService"),
    RegisterUserService: Symbol.for("RegisterUserService"),

    // Controllers
    UserController: Symbol.for("UserController"),
    AuthController: Symbol.for("AuthController"),

} as const;