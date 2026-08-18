import type { LoginRequestDto } from "../../../dtos/auth/LoginRequest.dto";
import type { AdminLoginResponseDto } from "../../../dtos/auth/AdminLoginResponse.dto";

export interface IAdminLoginService {
  execute(data: LoginRequestDto): Promise<AdminLoginResponseDto>;
}