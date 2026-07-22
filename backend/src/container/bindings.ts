import { type Container } from "inversify";

import { TYPES } from "./types";

import { ConsoleLogger } from "../shared/logger/ConsoleLogger";
import { type ILogger } from "../shared/logger/ILogger";

import { type IUserRepository } from "../interfaces/repositories/user/IUserRepository";
import { type IUserService } from "../interfaces/services/user/IUserService";
import { type IUserController } from "../interfaces/controllers/user/IUserController";

import { UserRepository } from "../repositories/user/UserRepository";
import { UserService } from "../services/user/UserService";
import { UserController } from "../controllers/user/UserController";


import type { IAuthRepository } from "../interfaces/repositories/auth/IAuthRepository";
import type { IAuthService } from "../interfaces/services/auth/IAuthService";
import type { IAuthController } from "../interfaces/controllers/auth/IAuthController";

import { AuthRepository } from "../repositories/auth/AuthRepository";
import { AuthService } from "../services/auth/AuthService";
import { AuthController } from "../controllers/auth/AuthController";



export function registerBindings(container: Container): void {
  container.bind<ILogger>(TYPES.Logger).to(ConsoleLogger).inSingletonScope();

  container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

  container.bind<IUserService>(TYPES.UserService).to(UserService);

  container.bind<IUserController>(TYPES.UserController).to(UserController);


  container.bind<IAuthRepository>(TYPES.AuthRepository).to(AuthRepository);

container.bind<IAuthService>(TYPES.AuthService).to(AuthService);

container.bind<IAuthController>(TYPES.AuthController).to(AuthController);
}