import { injectable } from "inversify";

import { IUser, UserModel } from "../../models/User.model";
import { BaseRepository } from "../base/BaseRepository";

import type { IUserRepository } from "../../interfaces/repositories/user/IUserRepository";

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
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
