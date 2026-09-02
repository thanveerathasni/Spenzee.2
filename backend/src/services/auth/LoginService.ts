import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { AuthMapper } from "../../mappers/auth/AuthMapper";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/messages/logMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { UserRole } from "../../shared/enums/UserRole";
import { AppError } from "../../shared/errors/AppError";

import type { LoginRequestDto } from "../../dtos/auth/LoginRequest.dto";
import type { UserLoginResponseDto } from "../../dtos/auth/UserLoginResponse.dto";
import type { IRefreshTokenRepository } from "../../interfaces/repositories/auth/IRefreshTokenRepository";
import type { IUserRepository } from "../../interfaces/repositories/user/IUserRepository";
import type { IJwtService } from "../../interfaces/services/auth/IJwtService";
import type { ILoginService } from "../../interfaces/services/auth/ILoginService";
import type { IPasswordService } from "../../interfaces/services/auth/IPasswordService";
import type { ILogger } from "../../shared/logger/ILogger";

@injectable()
export class LoginService implements ILoginService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TYPES.PasswordService)
    private readonly _passwordService: IPasswordService,

    @inject(TYPES.JwtService)
    private readonly _jwtService: IJwtService,

    @inject(TYPES.RefreshTokenRepository)
    private readonly _refreshTokenRepository: IRefreshTokenRepository,

    @inject(TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(data: LoginRequestDto): Promise<UserLoginResponseDto> {
    const user = await this._userRepository.findLoginUserByEmail(data.email);

    if (!user) {
      this._logger.warn(LOG_MESSAGES.LOGIN_USER_NOT_FOUND, {
        email: data.email,
      });

      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    if (user.deletedAt) {
      this._logger.warn(LOG_MESSAGES.LOGIN_FAILED, {
        email: data.email,
        reason: "soft-deleted account",
      });

      throw new AppError(
        ERROR_MESSAGES.USER_ACCOUNT_DELETED,
        HTTP_STATUS.FORBIDDEN,
      );
    }

    if (!user.isActive) {
      this._logger.warn(LOG_MESSAGES.LOGIN_FAILED, {
        email: data.email,
        reason: "inactive account",
      });

      throw new AppError(
        ERROR_MESSAGES.USER_ACCOUNT_INACTIVE,
        HTTP_STATUS.FORBIDDEN,
      );
    }

    if (!user.password) {
      this._logger.warn(LOG_MESSAGES.LOGIN_INVALID_PASSWORD, {
        email: data.email,
      });

      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    const passwordMatches = await this._passwordService.compare(
      data.password,
      user.password,
    );

    if (!passwordMatches) {
      this._logger.warn(LOG_MESSAGES.LOGIN_INVALID_PASSWORD, {
        email: data.email,
      });

      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    const userObjectId = user._id;

    if (!userObjectId) {
      this._logger.error(LOG_MESSAGES.LOGIN_FAILED, {
        email: data.email,
        reason: "user identifier missing",
      });

      throw new AppError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }

    const userId = userObjectId.toString();

    const payload = {
      userId,
      email: user.email,
      role: UserRole.USER,
    };

    const accessToken = this._jwtService.generateAccessToken(payload);
    const refreshToken = this._jwtService.generateRefreshToken(payload);

    try {
      await this._refreshTokenRepository.store({
        userId: userObjectId,
        userType: "User",
        token: refreshToken.token,
        expiresAt: refreshToken.expiresAt,
      });
    } catch (error) {
      this._logger.error("Failed to save refresh token.", { error });
      throw error;
    }

    await this._userRepository.updateById(userId, {
      lastLoginAt: new Date(),
    });

    this._logger.info(LOG_MESSAGES.USER_LOGGED_IN, { userId });

    return AuthMapper.toUserLoginResponse(
      user,
      accessToken,
      refreshToken.token,
    );
  }
}