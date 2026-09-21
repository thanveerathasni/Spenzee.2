import { randomBytes } from "node:crypto";

import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { AdminProviderMapper } from "../../mappers/admin/AdminProviderMapper";
import { AUTH_TOKEN_EXPIRY } from "../../shared/constants/auth";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { ProviderStatus } from "../../shared/enums/ProviderStatus";
import { AppError } from "../../shared/errors/AppError";

import type { IAdminProvider } from "../../dtos/admin/AdminProviderDto";
import type { IProviderPasswordSetupTokenRepository } from "../../interfaces/repositories/provider/IProviderPasswordSetupTokenRepository";
import type { IProviderRepository } from "../../interfaces/repositories/provider/IProviderRepository";
import type { IAdminProviderService } from "../../interfaces/services/admin/IAdminProviderService";
import type { IPasswordService } from "../../interfaces/services/auth/IPasswordService";
import type { IEmailService } from "../../interfaces/services/email/IEmailService";

@injectable()
export class AdminProviderService implements IAdminProviderService {
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly _providerRepository: IProviderRepository,

    @inject(TYPES.ProviderPasswordSetupTokenRepository)
    private readonly _providerPasswordSetupTokenRepository: IProviderPasswordSetupTokenRepository,

    @inject(TYPES.PasswordService)
    private readonly _passwordService: IPasswordService,

    @inject(TYPES.EmailService)
    private readonly _emailService: IEmailService,
  ) {}

  async getPendingProviders(): Promise<IAdminProvider[]> {
    const providers = await this._providerRepository.findByStatus(
      ProviderStatus.PENDING,
    );

    return AdminProviderMapper.toDtoList(providers);
  }

  async approveProvider(providerId: string): Promise<void> {
    const provider = await this._providerRepository.findById(providerId);

    if (!provider) {
      throw new AppError(
        "Provider not found.",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    if (provider.status !== ProviderStatus.PENDING) {
      throw new AppError(
        "Only pending providers can be approved.",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const passwordSetupToken = randomBytes(32).toString("hex");

    await this._providerPasswordSetupTokenRepository.upsertByProvider(
      providerId,
      passwordSetupToken,
      new Date(
        Date.now() +
          AUTH_TOKEN_EXPIRY.PROVIDER_PASSWORD_SETUP_MINUTES * 60 * 1000,
      ),
    );

    await this._providerRepository.updateStatus(
      providerId,
      ProviderStatus.PENDING,
      ProviderStatus.ACTIVE,
    );

    await this._emailService.sendProviderPasswordSetupEmail(
      provider.email,
      providerId,
      passwordSetupToken,
    );
  }

  async rejectProvider(providerId: string): Promise<void> {
    const provider = await this._providerRepository.findById(providerId);

    if (!provider) {
      throw new AppError(
        "Provider not found.",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    if (provider.status !== ProviderStatus.PENDING) {
      throw new AppError(
        "Only pending providers can be rejected.",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    await this._providerRepository.updateStatus(
      providerId,
      ProviderStatus.PENDING,
      ProviderStatus.REJECTED,
    );
  }

  async getActiveProviders(): Promise<IAdminProvider[]> {
    const providers = await this._providerRepository.findByStatus(
      ProviderStatus.ACTIVE,
    );

    return AdminProviderMapper.toDtoList(providers);
  }

  async blockProvider(providerId: string): Promise<void> {
    const provider = await this._providerRepository.findById(providerId);

    if (!provider) {
      throw new AppError(
        "Provider not found.",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    if (provider.status !== ProviderStatus.ACTIVE) {
      throw new AppError(
        "Only active providers can be blocked.",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    await this._providerRepository.updateStatus(
      providerId,
      ProviderStatus.ACTIVE,
      ProviderStatus.BLOCKED,
    );
  }

  async unblockProvider(providerId: string): Promise<void> {
    const provider = await this._providerRepository.findById(providerId);

    if (!provider) {
      throw new AppError(
        "Provider not found.",
        HTTP_STATUS.NOT_FOUND,
      );
    }

    if (provider.status !== ProviderStatus.BLOCKED) {
      throw new AppError(
        "Only blocked providers can be unblocked.",
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    await this._providerRepository.updateStatus(
      providerId,
      ProviderStatus.BLOCKED,
      ProviderStatus.ACTIVE,
    );
  }
}
