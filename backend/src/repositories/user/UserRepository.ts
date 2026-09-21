import { injectable } from "inversify";

import { UserModel } from "../../models/User.model";
import { BaseRepository } from "../base/BaseRepository";

import type { IUserRepository } from "../../interfaces/repositories/user/IUserRepository";
import type { IUser } from "../../models/User.model";

@injectable()
export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email });
  }

  async findLoginUserByEmail(email: string): Promise<IUser | null> {
    return this.model
      .findOne({
        email,
        deletedAt: null,
      })
      .select("+password");
  }
}
