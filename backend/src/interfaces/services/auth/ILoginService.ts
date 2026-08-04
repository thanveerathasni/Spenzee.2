import type { LoginRequestDto, LoginResponseDto } from "../../../dtos/auth/LoginRequest.dto";

export interface ILoginService {
  execute(data: LoginRequestDto): Promise<LoginResponseDto>;
}
