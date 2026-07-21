import { type Container } from "inversify";

import { TYPES } from "./types";

import { type IUserRepository } from "../interfaces/repositories/user/IUserRepository";
import { type IUserService } from "../interfaces/services/user/IUserService";
import { type IUserController } from "../interfaces/controllers/user/IUserController";

import { UserRepository } from "../repositories/user/UserRepository";
import { UserService } from "../services/user/UserService";
import { UserController } from "../controllers/user/UserController";

export function registerBindings(container: Container): void {
  container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

  container.bind<IUserService>(TYPES.UserService).to(UserService);

  container.bind<IUserController>(TYPES.UserController).to(UserController);
}
