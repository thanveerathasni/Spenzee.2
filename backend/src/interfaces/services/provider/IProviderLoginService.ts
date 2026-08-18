import type { LoginResponseDto } from "../../../dtos/auth/LoginRequest.dto";
import type { LoginRequestDto } from "../../../dtos/auth/LoginRequest.dto";

export interface IProviderLoginService {
  execute(data: LoginRequestDto): Promise<LoginResponseDto>;
}
