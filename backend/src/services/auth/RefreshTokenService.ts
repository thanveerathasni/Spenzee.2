import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import type {
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
} from "../../dtos/auth/RefreshToken.dto";
import type { IRefreshTokenRepository } from "../../interfaces/repositories/auth/IRefreshTokenRepository";
import type { IJwtService } from "../../interfaces/services/auth/IJwtService";
import type { IRefreshTokenService } from "../../interfaces/services/auth/IRefreshTokenService";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/messages/logMessages";
import { AppError } from "../../shared/errors/AppError";
import type { ILogger } from "../../shared/logger/ILogger";

@injectable()
export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    @inject(TYPES.RefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,

    @inject(TYPES.JwtService)
    private readonly jwtService: IJwtService,

    @inject(TYPES.Logger)
    private readonly logger: ILogger,
  ) {}

  async execute(data: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    const payload = this.jwtService.verifyRefreshToken(data.refreshToken);
    const storedToken = await this.refreshTokenRepository.findByToken(data.refreshToken);

    if (!storedToken || storedToken.userId.toString() !== payload.userId) {
      this.logger.warn(LOG_MESSAGES.REFRESH_TOKEN_FAILED, {
        userId: payload.userId,
        reason: "refresh token not found",
      });
      throw new AppError(ERROR_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }

    if (storedToken.expiresAt.getTime() <= Date.now()) {
      await this.refreshTokenRepository.deleteByToken(data.refreshToken);
      this.logger.warn(LOG_MESSAGES.REFRESH_TOKEN_FAILED, {
        userId: payload.userId,
        reason: "stored refresh token expired",
      });
      throw new AppError(ERROR_MESSAGES.TOKEN_EXPIRED, HTTP_STATUS.UNAUTHORIZED);
    }

    const deleted = await this.refreshTokenRepository.deleteByToken(data.refreshToken);

    if (!deleted) {
      this.logger.warn(LOG_MESSAGES.REFRESH_TOKEN_FAILED, {
        userId: payload.userId,
        reason: "refresh token was already rotated",
      });
      throw new AppError(ERROR_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }

    const accessToken = this.jwtService.generateAccessToken(payload);
    const refreshToken = this.jwtService.generateRefreshToken(payload);

    await this.refreshTokenRepository.store({
      userId: storedToken.userId,
      userType: storedToken.userType,
      token: refreshToken.token,
      expiresAt: refreshToken.expiresAt,
    });

    this.logger.info(LOG_MESSAGES.REFRESH_TOKEN_ROTATED, {
      userId: payload.userId,
    });

    return {
      accessToken,
      refreshToken: refreshToken.token,
    };
  }
}
