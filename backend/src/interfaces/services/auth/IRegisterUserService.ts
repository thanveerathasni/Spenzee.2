import type{ RegisterUserDto } from "../../../dtos/auth/RegisterUser.dto";

export interface IRegisterUserService {
    register(
        data: RegisterUserDto,
    ): Promise<void>;
}