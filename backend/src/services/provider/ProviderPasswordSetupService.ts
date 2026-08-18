import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { AppError } from "../../shared/errors/AppError";

import type { IProviderPasswordSetupTokenRepository } from "../../interfaces/repositories/provider/IProviderPasswordSetupTokenRepository";
import type { IProviderRepository } from "../../interfaces/repositories/provider/IProviderRepository";
import type { IPasswordService } from "../../interfaces/services/auth/IPasswordService";
import type { IProviderPasswordSetupService } from "../../interfaces/services/provider/IProviderPasswordSetupService";

@injectable()
export class ProviderPasswordSetupService
  implements IProviderPasswordSetupService
{
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly _providerRepository: IProviderRepository,

    @inject(TYPES.ProviderPasswordSetupTokenRepository)
    private readonly _tokenRepository: IProviderPasswordSetupTokenRepository,

    @inject(TYPES.PasswordService)
    private readonly _passwordService: IPasswordService,
  ) {}

  async execute(
    providerId: string,
    token: string,
    password: string,
  ): Promise<void> {
    const setupToken =
      await this._tokenRepository.findByProvider(providerId);

    if (!setupToken) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    if (setupToken.expiresAt.getTime() <= Date.now()) {
      await this._tokenRepository.deleteByProvider(providerId);

      throw new AppError(
        ERROR_MESSAGES.TOKEN_EXPIRED,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    if (setupToken.token !== token) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    const provider = await this._providerRepository.findById(providerId);

    if (!provider) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    const hashedPassword = await this._passwordService.hash(password);

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
  }



}






