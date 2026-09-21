import type { IProviderPasswordSetupToken } from "../../../models/ProviderPasswordSetupToken.model";
import type { IBaseRepository } from "../base/IBaseRepository";

export interface IProviderPasswordSetupTokenRepository
  extends IBaseRepository<IProviderPasswordSetupToken> {
  upsertByProvider(
    providerId: string,
    token: string,
    expiresAt: Date,
  ): Promise<IProviderPasswordSetupToken>;

  findByProvider(
    providerId: string,
  ): Promise<IProviderPasswordSetupToken | null>;

  deleteByProvider(providerId: string): Promise<boolean>;
}



