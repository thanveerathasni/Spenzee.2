import { injectable } from "inversify";

import { SoftDeleteRepository } from "../base/SoftDeleteRepository";

import type { IUserRepository } from "../../interfaces/repositories/user/IUserRepository";

import { IUser, UserModel } from "../../models/User.model";

@injectable()
export class UserRepository extends SoftDeleteRepository<IUser> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email });
  }

  async findLoginUserByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email }).select("+password");
  }
}
