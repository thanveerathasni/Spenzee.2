import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import type {
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
} from "../../dtos/auth/RefreshToken.dto";
import type { IRefreshTokenRepository } from "../../interfaces/repositories/auth/IRefreshTokenRepository";
import type { IJwtService, JwtPayload } from "../../interfaces/services/auth/IJwtService";
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
    private readonly _refreshTokenRepository: IRefreshTokenRepository,

    @inject(TYPES.JwtService)
    private readonly _jwtService: IJwtService,

    @inject(TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(data: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    const payload = this._jwtService.verifyRefreshToken(data.refreshToken);
    const storedToken = await this._refreshTokenRepository.findByToken(data.refreshToken);
this._logger.info("Refresh token lookup result.", {
  found: !!storedToken,
  userId: storedToken?.userId?.toString(),
  payloadUserId: payload.userId,
});
    if (!storedToken || storedToken.userId.toString() !== payload.userId) {
      this._logger.warn(LOG_MESSAGES.REFRESH_TOKEN_FAILED, {
        userId: payload.userId,
        reason: "refresh token not found",
      });
      throw new AppError(ERROR_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }

    if (storedToken.expiresAt.getTime() <= Date.now()) {
      await this._refreshTokenRepository.deleteByToken(data.refreshToken);
      this._logger.warn(LOG_MESSAGES.REFRESH_TOKEN_FAILED, {
        userId: payload.userId,
        reason: "stored refresh token expired",
      });
      throw new AppError(ERROR_MESSAGES.TOKEN_EXPIRED, HTTP_STATUS.UNAUTHORIZED);
    }

    const deleted = await this._refreshTokenRepository.deleteByToken(data.refreshToken);

    if (!deleted) {
      this._logger.warn(LOG_MESSAGES.REFRESH_TOKEN_FAILED, {
        userId: payload.userId,
        reason: "refresh token was already rotated",
      });
      throw new AppError(ERROR_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }

   const newPayload: JwtPayload = {
  userId: payload.userId,
  email: payload.email,
  role: payload.role,
};

const accessToken =
  this._jwtService.generateAccessToken(newPayload);

const refreshToken =
  this._jwtService.generateRefreshToken(newPayload);
    await this._refreshTokenRepository.store({
      userId: storedToken.userId,
      userType: storedToken.userType,
      token: refreshToken.token,
      expiresAt: refreshToken.expiresAt,
    });

    this._logger.info(LOG_MESSAGES.REFRESH_TOKEN_ROTATED, {
      userId: payload.userId,
    });

    return {
      accessToken,
      refreshToken: refreshToken.token,
    };
  }
}
