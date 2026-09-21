import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { ProviderStatus } from "../../shared/enums/ProviderStatus";
import { AppError } from "../../shared/errors/AppError";

import type { ResetPasswordDto } from "../../dtos/auth/ResetPassword.dto";
import type { IRefreshTokenRepository } from "../../interfaces/repositories/auth/IRefreshTokenRepository";
import type { IProviderRepository } from "../../interfaces/repositories/provider/IProviderRepository";
import type { IProviderResetPasswordTokenRepository } from "../../interfaces/repositories/provider/IProviderResetPasswordTokenRepository";
import type { IPasswordService } from "../../interfaces/services/auth/IPasswordService";
import type { IProviderResetPasswordService } from "../../interfaces/services/provider/IProviderResetPasswordService";

@injectable()
export class ProviderResetPasswordService
  implements IProviderResetPasswordService
{
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly _providerRepository: IProviderRepository,

    @inject(TYPES.ProviderResetPasswordTokenRepository)
    private readonly _tokenRepository: IProviderResetPasswordTokenRepository,

    @inject(TYPES.PasswordService)
    private readonly _passwordService: IPasswordService,

    @inject(TYPES.RefreshTokenRepository)
    private readonly _refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(data: ResetPasswordDto): Promise<void> {
    const provider = await this._providerRepository.findByEmail(data.email);

    if (!provider?._id) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_RESET_TOKEN,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    if (provider.status !== ProviderStatus.ACTIVE) {
      throw new AppError(
        ERROR_MESSAGES.USER_ACCOUNT_INACTIVE,
        HTTP_STATUS.FORBIDDEN,
      );
    }

    const providerId = provider._id.toString();

    const resetToken = await this._tokenRepository.findByProvider(
      providerId,
    );

    if (!resetToken) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_RESET_TOKEN,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    if (resetToken.expiresAt.getTime() <= Date.now()) {
      await this._tokenRepository.deleteByProvider(providerId);

      throw new AppError(
        ERROR_MESSAGES.TOKEN_EXPIRED,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    const tokenMatches = await this._passwordService.compare(
      data.token,
      resetToken.token,
    );

    if (!tokenMatches) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_RESET_TOKEN,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    const hashedPassword = await this._passwordService.hash(
      data.password,
    );

    const updatedProvider = await this._providerRepository.updateById(
      providerId,
      {
        password: hashedPassword,
      },
    );

    if (!updatedProvider) {
      throw new AppError(
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }

    await this._tokenRepository.deleteByProvider(providerId);

    await this._refreshTokenRepository.deleteByUserId(providerId);
  }
}