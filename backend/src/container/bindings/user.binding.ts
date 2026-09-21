import { UserController } from "../../controllers/user/UserController";
import { UserRepository } from "../../repositories/user/UserRepository";
import { UserService } from "../../services/user/UserService";
import { TYPES } from "../types";

import type { IUserController } from "../../interfaces/controllers/user/IUserController";
import type { IUserRepository } from "../../interfaces/repositories/user/IUserRepository";
import type { IUserService } from "../../interfaces/services/user/IUserService";
import type { Container } from "inversify";




export function registerUserBindings(container: Container): void {
  container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

  container.bind<IUserService>(TYPES.UserService).to(UserService);

  container.bind<IUserController>(TYPES.UserController).to(UserController);
}
