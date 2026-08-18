import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";

import type { IUserRepository } from "../../interfaces/repositories/user/IUserRepository";
import type { IUserService } from "../../interfaces/services/user/IUserService";
import type { IUser } from "../../models/User.model";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  async createUser(user: Partial<IUser>): Promise<IUser> {
    const existingUser = await this._userRepository.findByEmail(user.email!);

    if (existingUser) {
      throw new Error("Email already exists.");
    }

    return this._userRepository.create(user);
  }

  async getUserById(id: string): Promise<IUser | null> {
    return this._userRepository.findById(id);
  }

  async updateUser(id: string, user: Partial<IUser>): Promise<IUser | null> {
    return this._userRepository.updateById(id, user);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return this._userRepository.findByEmail(email);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this._userRepository.softDelete({
      _id: id,
    });
  }
}
