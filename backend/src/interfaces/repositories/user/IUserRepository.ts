import { IUser } from "../../../models/User.model";
import { IBaseRepository } from "../base/IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
}