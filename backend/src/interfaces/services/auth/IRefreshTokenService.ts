import type {
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
} from "../../../dtos/auth/RefreshToken.dto";

export interface IRefreshTokenService {
  execute(data: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto>;
}
