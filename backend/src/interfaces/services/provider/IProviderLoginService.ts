import type { LoginRequestDto } from "../../../dtos/auth/LoginRequest.dto";
import type { ProviderLoginResponseDto } from "../../../dtos/auth/ProviderLoginResponse.dto";

export interface IProviderLoginService {
  execute(data: LoginRequestDto): Promise<ProviderLoginResponseDto>;
}
