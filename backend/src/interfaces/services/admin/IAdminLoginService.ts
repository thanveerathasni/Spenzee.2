import type { AdminLoginResponseDto } from "../../../dtos/auth/AdminLoginResponse.dto";
import type { LoginRequestDto } from "../../../dtos/auth/LoginRequest.dto";

export interface IAdminLoginService {
  execute(data: LoginRequestDto): Promise<AdminLoginResponseDto>;
}
