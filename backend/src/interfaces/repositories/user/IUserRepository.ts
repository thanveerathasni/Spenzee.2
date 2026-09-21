import type { IUser } from "../../../models/User.model";
import type { IBaseRepository } from "../base/IBaseRepository";
import type { ISoftDeleteRepository } from "../base/ISoftDeleteRepository";

export interface IUserRepository extends IBaseRepository<IUser>, ISoftDeleteRepository {
  findByEmail(email: string): Promise<IUser | null>;

  findLoginUserByEmail(email: string): Promise<IUser | null>;
}
