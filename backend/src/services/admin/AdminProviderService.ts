import { randomBytes } from "node:crypto";

import { inject, injectable } from "inversify";

import type { IAdminProvider } from "../../dtos/admin/AdminProviderDto";
import { TYPES } from "../../container/types";
import { AdminProviderMapper } from "../../mappers/admin/AdminProviderMapper";
import { AUTH_TOKEN_EXPIRY } from "../../shared/constants/auth";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { ProviderStatus } from "../../shared/enums/ProviderStatus";
import { AppError } from "../../shared/errors/AppError";

import type { IProviderPasswordSetupTokenRepository } from "../../interfaces/repositories/provider/IProviderPasswordSetupTokenRepository";
import type { IProviderRepository } from "../../interfaces/repositories/provider/IProviderRepository";
import type { IAdminProviderService } from "../../interfaces/services/admin/IAdminProviderService";
import type { IEmailService } from "../../interfaces/services/email/IEmailService";
import type { IPasswordService } from "../../interfaces/services/auth/IPasswordService";

@injectable()
export class AdminProviderService implements IAdminProviderService {
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly _providerRepository: IProviderRepository,

    @inject(TYPES.ProviderPasswordSetupTokenRepository)
    private readonly _tokenRepository: IProviderPasswordSetupTokenRepository,

    @inject(TYPES.EmailService)
    private readonly _emailService: IEmailService,

    @inject(TYPES.PasswordService)
    private readonly _passwordService: IPasswordService,
  ) {}

  async getPendingProviders(): Promise<IAdminProvider[]> {
    const providers = await this._providerRepository.findByStatus(
      ProviderStatus.PENDING,
    );

    return AdminProviderMapper.toDtoList(providers);
  }

  async approveProvider(providerId: string): Promise<void> {
    const provider = await this._providerRepository.updateStatus(
      providerId,
      ProviderStatus.PENDING,
      ProviderStatus.ACTIVE,
    );

    if (!provider) {
      throw new AppError(
        ERROR_MESSAGES.RESOURCE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    const token = randomBytes(32).toString("hex");

    const hashedToken = await this._passwordService.hash(token);

    const expiresAt = new Date(
      Date.now() + AUTH_TOKEN_EXPIRY.RESET_PASSWORD_MINUTES * 60 * 1000,
    );

    await this._tokenRepository.upsertByProvider(
      providerId,
      hashedToken,
      expiresAt,
    );

    await this._emailService.sendProviderPasswordSetupEmail(
      provider.email,
      providerId,
      token,
    );
  }

  async rejectProvider(providerId: string): Promise<void> {
    const provider = await this._providerRepository.updateStatus(
      providerId,
      ProviderStatus.PENDING,
      ProviderStatus.REJECTED,
    );

    if (!provider) {
      throw new AppError(
        ERROR_MESSAGES.RESOURCE_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }
  }

  async getActiveProviders(): Promise<IAdminProvider[]> {
    const providers = await this._providerRepository.findByStatus(
      ProviderStatus.ACTIVE,
    );

    return AdminProviderMapper.toDtoList(providers);
  }
}