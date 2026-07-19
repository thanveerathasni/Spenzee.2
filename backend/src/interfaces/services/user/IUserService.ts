
import {IUser} from "../../../models/User.model"


export interface IUserService{

    createUser(user: Partial<IUser>):Promise<IUser>

  getUserById(id: string): Promise<IUser | null>;

    getUserByEmail(email: string): Promise<IUser | null>;

    updateUser(
        id: string,
        user: Partial<IUser>
    ): Promise<IUser | null>;

    deleteUser(id: string): Promise<boolean>;
}




















