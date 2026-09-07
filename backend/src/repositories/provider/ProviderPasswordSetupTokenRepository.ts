import { injectable } from "inversify";

import { ProviderPasswordSetupTokenModel } from "../../models/ProviderPasswordSetupToken.model";
import { BaseRepositoryWithoutSoftDelete } from "../base/BaseRepositoryWithoutSoftDelete";

import type { IProviderPasswordSetupTokenRepository } from "../../interfaces/repositories/provider/IProviderPasswordSetupTokenRepository";
import type { IProviderPasswordSetupToken } from "../../models/ProviderPasswordSetupToken.model";

@injectable()
export class ProviderPasswordSetupTokenRepository
  extends BaseRepositoryWithoutSoftDelete<IProviderPasswordSetupToken>
  implements IProviderPasswordSetupTokenRepository
{
  constructor() {
    super(ProviderPasswordSetupTokenModel);
  }

  async upsertByProvider(
    providerId: string,
    token: string,
    expiresAt: Date,
  ): Promise<IProviderPasswordSetupToken> {
    return this.model.findOneAndUpdate(
      { provider: providerId },
      {
        provider: providerId,
        token,
        expiresAt,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  async findByProvider(
    providerId: string,
  ): Promise<IProviderPasswordSetupToken | null> {
    return this.model.findOne({
      provider: providerId,
    });
  }

  async deleteByProvider(
    providerId: string,
  ): Promise<boolean> {
    return this.forceDelete({
      provider: providerId,
    });
  }
}
