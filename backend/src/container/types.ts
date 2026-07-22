export const TYPES = {
  Logger: Symbol.for("Logger"),

  UserRepository: Symbol.for("UserRepository"),

  UserService: Symbol.for("UserService"),

  UserController: Symbol.for("UserController"),



// auth  types 

AuthRepository : Symbol.for("AuthRepository"),


AuthService: Symbol.for("AuthService"),

AuthController: Symbol.for("AuthController"),


} as const;