import { randomBytes } from "node:crypto";

import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { AUTH_TOKEN_EXPIRY } from "../../shared/constants/auth";
import { ProviderStatus } from "../../shared/enums/ProviderStatus";

import type { IProviderPasswordSetupTokenRepository } from "../../interfaces/repositories/provider/IProviderPasswordSetupTokenRepository";
import type { IProviderRepository } from "../../interfaces/repositories/provider/IProviderRepository";
import type { IAdminProviderService } from "../../interfaces/services/admin/IAdminProviderService";
import type { IEmailService } from "../../interfaces/services/email/IEmailService";
import type { IProvider } from "../../models/Provider.model";

@injectable()
export class AdminProviderService implements IAdminProviderService {
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly _providerRepository: IProviderRepository,

    @inject(TYPES.ProviderPasswordSetupTokenRepository)
    private readonly _tokenRepository: IProviderPasswordSetupTokenRepository,
    @inject(TYPES.EmailService)
private readonly _emailService: IEmailService,
  ) {}

  async getPendingProviders(): Promise<IProvider[]> {
    return this._providerRepository.findByStatus(ProviderStatus.PENDING);
  }

  async approveProvider(providerId: string): Promise<void> {
    const provider = await this._providerRepository.updateStatus(
      providerId,
      ProviderStatus.ACTIVE,
    );

    if (!provider) {
      return;
    }

    const token = randomBytes(32).toString("hex");

    const expiresAt = new Date(
      Date.now() + AUTH_TOKEN_EXPIRY.RESET_PASSWORD_MINUTES * 60 * 1000,
    );

    await this._tokenRepository.upsertByProvider(
      providerId,
      token,
      expiresAt,
    );
    await this._emailService.sendProviderPasswordSetupEmail(
  provider.email,
  token,
);
  }

  async rejectProvider(providerId: string): Promise<void> {
    await this._providerRepository.updateStatus(
      providerId,
      ProviderStatus.REJECTED,
    );
  }
}
