import type { RegisterUserDto } from "../../../dtos/auth/RegisterUser.dto";

export interface IRegisterUserService {
  execute(data: RegisterUserDto): Promise<void>;
}
