import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { ProviderStatus } from "../../shared/enums/ProviderStatus";
import { UserRole } from "../../shared/enums/UserRole";
import { AppError } from "../../shared/errors/AppError";

import type {
  LoginRequestDto,
  LoginResponseDto,
} from "../../dtos/auth/LoginRequest.dto";
import type { IRefreshTokenRepository } from "../../interfaces/repositories/auth/IRefreshTokenRepository";
import type { IProviderRepository } from "../../interfaces/repositories/provider/IProviderRepository";
import type { IJwtService } from "../../interfaces/services/auth/IJwtService";
import type { IPasswordService } from "../../interfaces/services/auth/IPasswordService";
import type { IProviderLoginService } from "../../interfaces/services/provider/IProviderLoginService";

@injectable()
export class ProviderLoginService implements IProviderLoginService {
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly _providerRepository: IProviderRepository,

    @inject(TYPES.PasswordService)
    private readonly _passwordService: IPasswordService,

    @inject(TYPES.JwtService)
    private readonly _jwtService: IJwtService,

    @inject(TYPES.RefreshTokenRepository)
    private readonly _refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(data: LoginRequestDto): Promise<LoginResponseDto> {
    const provider = await this._providerRepository.findByEmail(data.email);

    if ( !provider?.password) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    if (provider.status !== ProviderStatus.ACTIVE) {
      throw new AppError(
        ERROR_MESSAGES.USER_ACCOUNT_INACTIVE,
        HTTP_STATUS.FORBIDDEN,
      );
    }

    const passwordMatches = await this._passwordService.compare(
      data.password,
      provider.password,
    );

    if (!passwordMatches) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    const providerObjectId = provider._id;

    if (!providerObjectId) {
      throw new AppError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }

    const providerId = providerObjectId.toString();

    const payload = {
      userId: providerId,
      email: provider.email,
      role: UserRole.PROVIDER,
    };

    const accessToken = this._jwtService.generateAccessToken(payload);
    const refreshToken = this._jwtService.generateRefreshToken(payload);

    await this._refreshTokenRepository.store({
      userId: providerObjectId,
      userType: "Provider",
      token: refreshToken.token,
      expiresAt: refreshToken.expiresAt,
    });

    await this._providerRepository.updateById(providerId, {
      lastLoginAt: new Date(),
    });

  return {
  accessToken,
  refreshToken: refreshToken.token,
  user: {
    id: providerId,
    firstName: "",
    lastName: "",
    email: provider.email,
    isActive: true,
    isVerified: true,
  },
};
  }
}
