import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";

import type { LogoutRequestDto } from "../../dtos/auth/Logout.dto";
import type { IRefreshTokenRepository } from "../../interfaces/repositories/auth/IRefreshTokenRepository";
import type { IJwtService } from "../../interfaces/services/auth/IJwtService";
import type { ILogoutService } from "../../interfaces/services/auth/ILogoutService";

import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/messages/logMessages";
import { AppError } from "../../shared/errors/AppError";

import type { ILogger } from "../../shared/logger/ILogger";

@injectable()
export class LogoutService implements ILogoutService {
  constructor(
    @inject(TYPES.RefreshTokenRepository)
    private readonly _refreshTokenRepository: IRefreshTokenRepository,

    @inject(TYPES.JwtService)
    private readonly _jwtService: IJwtService,

    @inject(TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(data: LogoutRequestDto): Promise<void> {
    const payload = this._jwtService.verifyRefreshToken(
      data.refreshToken,
    );

    const storedToken =
      await this._refreshTokenRepository.findByToken(
        data.refreshToken,
      );

    if (
      !storedToken ||
      storedToken.userId.toString() !== payload.userId
    ) {
      this._logger.warn(
        LOG_MESSAGES.LOGOUT_FAILED,
        {
          userId: payload.userId,
          reason: "refresh token not found",
        },
      );

      throw new AppError(
        ERROR_MESSAGES.INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    const deleted =
      await this._refreshTokenRepository.deleteByToken(
        data.refreshToken,
      );

    if (!deleted) {
      this._logger.warn(
        LOG_MESSAGES.LOGOUT_FAILED,
        {
          userId: payload.userId,
          reason: "refresh token was already revoked",
        },
      );

      throw new AppError(
        ERROR_MESSAGES.INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    this._logger.info(
      LOG_MESSAGES.LOGGED_OUT,
      {
        userId: payload.userId,
      },
    );
  }
}