import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { AppError } from "../../shared/errors/AppError";

import type { ResetPasswordDto } from "../../dtos/auth/ResetPassword.dto";
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
  ) {}

  async execute(data: ResetPasswordDto): Promise<void> {
    const provider = await this._providerRepository.findByEmail(data.email);

    if (!provider?._id) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_RESET_TOKEN,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    const resetToken = await this._tokenRepository.findByProvider(
      provider._id.toString(),
    );

    if (!resetToken) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_RESET_TOKEN,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    if (resetToken.expiresAt.getTime() <= Date.now()) {
      await this._tokenRepository.deleteByProvider(
        provider._id.toString(),
      );

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

    const hashedPassword = await this._passwordService.hash(data.password);

    const updatedProvider = await this._providerRepository.updateById(
      provider._id.toString(),
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

    await this._tokenRepository.deleteByProvider(
      provider._id.toString(),
    );
  }
}
