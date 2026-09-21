import type { LoginRequestDto } from "../../../dtos/auth/LoginRequest.dto";
import type { UserLoginResponseDto } from "../../../dtos/auth/UserLoginResponse.dto";

export interface ILoginService {
  execute(data: LoginRequestDto): Promise<UserLoginResponseDto>;
}
