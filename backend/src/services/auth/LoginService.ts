import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import type { LoginRequestDto, LoginResponseDto } from "../../dtos/auth/LoginRequest.dto";
import type { IRefreshTokenRepository } from "../../interfaces/repositories/auth/IRefreshTokenRepository";
import type { IUserRepository } from "../../interfaces/repositories/user/IUserRepository";
import type { IJwtService } from "../../interfaces/services/auth/IJwtService";
import type { ILoginService } from "../../interfaces/services/auth/ILoginService";
import type { IPasswordService } from "../../interfaces/services/auth/IPasswordService";
import type { ILogger } from "../../shared/logger/ILogger";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/messages/logMessages";
import { AppError } from "../../shared/errors/AppError";

@injectable()
export class LoginService implements ILoginService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,

    @inject(TYPES.PasswordService)
    private readonly passwordService: IPasswordService,

    @inject(TYPES.JwtService)
    private readonly jwtService: IJwtService,

    @inject(TYPES.RefreshTokenRepository)
    private readonly refreshTokenRepository: IRefreshTokenRepository,

    @inject(TYPES.Logger)
    private readonly logger: ILogger,
  ) {}

  async execute(data: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findLoginUserByEmail(data.email);

    if (!user) {
      this.logger.warn(LOG_MESSAGES.LOGIN_USER_NOT_FOUND, {
        email: data.email,
      });
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    if (user.deletedAt) {
      this.logger.warn(LOG_MESSAGES.LOGIN_FAILED, {
        email: data.email,
        reason: "soft-deleted account",
      });
      throw new AppError(ERROR_MESSAGES.USER_ACCOUNT_DELETED, HTTP_STATUS.FORBIDDEN);
    }

    if (!user.isActive) {
      this.logger.warn(LOG_MESSAGES.LOGIN_FAILED, {
        email: data.email,
        reason: "inactive account",
      });
      throw new AppError(ERROR_MESSAGES.USER_ACCOUNT_INACTIVE, HTTP_STATUS.FORBIDDEN);
    }

    if (!user.password) {
      this.logger.warn(LOG_MESSAGES.LOGIN_INVALID_PASSWORD, {
        email: data.email,
      });
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    const passwordMatches = await this.passwordService.compare(data.password, user.password);

    if (!passwordMatches) {
      this.logger.warn(LOG_MESSAGES.LOGIN_INVALID_PASSWORD, {
        email: data.email,
      });
      throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
    }

    const userObjectId = user._id;

    if (!userObjectId) {
      this.logger.error(LOG_MESSAGES.LOGIN_FAILED, {
        email: data.email,
        reason: "user identifier missing",
      });
      throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    const userId = userObjectId.toString();

    const payload = { userId, email: user.email };
    const accessToken = this.jwtService.generateAccessToken(payload);
    const refreshToken = this.jwtService.generateRefreshToken(payload);

    await this.refreshTokenRepository.store({
      userId: userObjectId,
      userType: "User",
      token: refreshToken.token,
      expiresAt: refreshToken.expiresAt,
    });
    await this.userRepository.updateById(userId, {
      lastLoginAt: new Date(),
    });

    this.logger.info(LOG_MESSAGES.USER_LOGGED_IN, { userId });

    return {
      accessToken,
      refreshToken: refreshToken.token,
      user: {
        id: userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
        isVerified: user.isVerified,
      },
    };
  }
}
