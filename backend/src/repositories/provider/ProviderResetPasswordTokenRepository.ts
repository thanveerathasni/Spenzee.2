import { injectable } from "inversify";

import { ProviderResetPasswordTokenModel } from "../../models/ProviderResetPasswordToken.model";
import { BaseRepositoryWithoutSoftDelete } from "../base/BaseRepositoryWithoutSoftDelete";

import type { IProviderResetPasswordTokenRepository } from "../../interfaces/repositories/provider/IProviderResetPasswordTokenRepository";
import type { IProviderResetPasswordToken } from "../../models/ProviderResetPasswordToken.model";

@injectable()
export class ProviderResetPasswordTokenRepository
  extends BaseRepositoryWithoutSoftDelete<IProviderResetPasswordToken>
  implements IProviderResetPasswordTokenRepository
{
  constructor() {
    super(ProviderResetPasswordTokenModel);
  }

  async upsertByProvider(
    providerId: string,
    token: string,
    expiresAt: Date,
  ): Promise<IProviderResetPasswordToken> {
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
  ): Promise<IProviderResetPasswordToken | null> {
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
