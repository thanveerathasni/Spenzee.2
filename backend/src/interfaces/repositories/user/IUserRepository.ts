import { type IUser } from "../../../models/User.model";
import { type IBaseRepository } from "../base/IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}
