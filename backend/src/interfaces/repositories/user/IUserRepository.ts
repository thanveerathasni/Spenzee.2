import { IUser } from "../../../models/User.model";
import { ISoftDeleteRepository } from "../base/ISoftDeleteRepository";

export interface IUserRepository
    extends ISoftDeleteRepository<IUser> {
    findByEmail(
        email: string,
    ): Promise<IUser | null>;
}