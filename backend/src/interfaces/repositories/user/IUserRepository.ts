import type{ IUser } from "../../../models/User.model";
import type{ ISoftDeleteRepository } from "../base/ISoftDeleteRepository";

export interface IUserRepository
    extends ISoftDeleteRepository<IUser> {
    findByEmail(
        email: string,
    ): Promise<IUser | null>;
}
