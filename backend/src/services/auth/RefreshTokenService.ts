import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/messages/logMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { ProviderStatus } from "../../shared/enums/ProviderStatus";
import { UserRole } from "../../shared/enums/UserRole";
import { AppError } from "../../shared/errors/AppError";

import type {
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
} from "../../dtos/auth/RefreshToken.dto";
import type { IAdminRepository } from "../../interfaces/repositories/admin/IAdminRepository";
import type { IRefreshTokenRepository } from "../../interfaces/repositories/auth/IRefreshTokenRepository";
import type { IProviderRepository } from "../../interfaces/repositories/provider/IProviderRepository";
import type { IUserRepository } from "../../interfaces/repositories/user/IUserRepository";
import type {
  IJwtService,
  JwtPayload,
} from "../../interfaces/services/auth/IJwtService";
import type { IRefreshTokenService } from "../../interfaces/services/auth/IRefreshTokenService";
import type { ILogger } from "../../shared/logger/ILogger";

@injectable()
export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    @inject(TYPES.RefreshTokenRepository)
    private readonly _refreshTokenRepository: IRefreshTokenRepository,

    @inject(TYPES.JwtService)
    private readonly _jwtService: IJwtService,

    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TYPES.ProviderRepository)
    private readonly _providerRepository: IProviderRepository,

    @inject(TYPES.AdminRepository)
    private readonly _adminRepository: IAdminRepository,

    @inject(TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(
    data: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    const payload = this._jwtService.verifyRefreshToken(
      data.refreshToken,
    );

    const storedToken =
      await this._refreshTokenRepository.findByToken(
        data.refreshToken,
      );

    if (
      !storedToken ||
      storedToken.userId?.toString() !== payload.userId
    ) {
      this._logger.warn(LOG_MESSAGES.REFRESH_TOKEN_FAILED, {
        userId: payload.userId,
        reason: "refresh token not found",
      });

      throw new AppError(
        ERROR_MESSAGES.INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    if (
      !this._isUserTypeMatchingRole(
        storedToken.userType,
        payload.role,
      )
    ) {
      await this._refreshTokenRepository.deleteByToken(
        data.refreshToken,
      );

      this._logger.warn(LOG_MESSAGES.REFRESH_TOKEN_FAILED, {
        userId: payload.userId,
        reason: "refresh token account type mismatch",
      });

      throw new AppError(
        ERROR_MESSAGES.INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    if (storedToken.expiresAt.getTime() <= Date.now()) {
      await this._refreshTokenRepository.deleteByToken(
        data.refreshToken,
      );

      this._logger.warn(LOG_MESSAGES.REFRESH_TOKEN_FAILED, {
        userId: payload.userId,
        reason: "stored refresh token expired",
      });

      throw new AppError(
        ERROR_MESSAGES.TOKEN_EXPIRED,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    const accountIsActive = await this._isAccountActive(
      payload,
      storedToken.userType,
    );

    if (!accountIsActive) {
      await this._refreshTokenRepository.deleteByToken(
        data.refreshToken,
      );

      this._logger.warn(LOG_MESSAGES.REFRESH_TOKEN_FAILED, {
        userId: payload.userId,
        reason: "account is inactive",
      });

      throw new AppError(
        ERROR_MESSAGES.USER_ACCOUNT_INACTIVE,
        HTTP_STATUS.FORBIDDEN,
      );
    }

    const deleted = await this._refreshTokenRepository.deleteByToken(
      data.refreshToken,
    );

    if (!deleted) {
      this._logger.warn(LOG_MESSAGES.REFRESH_TOKEN_FAILED, {
        userId: payload.userId,
        reason: "refresh token was already rotated",
      });

      throw new AppError(
        ERROR_MESSAGES.INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED,
      );
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

  private _isUserTypeMatchingRole(
    userType: "User" | "Provider" | "Admin",
    role: UserRole,
  ): boolean {
    const expectedUserTypeByRole: Record<
      UserRole,
      "User" | "Provider" | "Admin"
    > = {
      [UserRole.USER]: "User",
      [UserRole.PROVIDER]: "Provider",
      [UserRole.ADMIN]: "Admin",
    };

    return expectedUserTypeByRole[role] === userType;
  }

  private async _isAccountActive(
    payload: JwtPayload,
    userType: "User" | "Provider" | "Admin",
  ): Promise<boolean> {
    switch (userType) {
      case "User": {
        const user = await this._userRepository.findById(
          payload.userId,
        );

        return !!user?.isActive;
      }

      case "Provider": {
        const provider = await this._providerRepository.findById(
          payload.userId,
        );

        return provider?.status === ProviderStatus.ACTIVE;
      }

      case "Admin": {
        const admin = await this._adminRepository.findById(
          payload.userId,
        );

        return !!admin?.isActive;
      }

      default:
        return false;
    }
  }
}
