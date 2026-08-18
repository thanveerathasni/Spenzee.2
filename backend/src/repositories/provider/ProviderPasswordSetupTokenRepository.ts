import { injectable } from "inversify";

import { ProviderPasswordSetupTokenModel } from "../../models/ProviderPasswordSetupToken.model";

import type { IProviderPasswordSetupTokenRepository } from "../../interfaces/repositories/provider/IProviderPasswordSetupTokenRepository";
import type { IProviderPasswordSetupToken } from "../../models/ProviderPasswordSetupToken.model";

@injectable()
export class ProviderPasswordSetupTokenRepository
  implements IProviderPasswordSetupTokenRepository
{
  async create(
    data: Partial<IProviderPasswordSetupToken>,
  ): Promise<IProviderPasswordSetupToken> {
    return ProviderPasswordSetupTokenModel.create(data);
  }

  async findById(
    id: string,
  ): Promise<IProviderPasswordSetupToken | null> {
    return ProviderPasswordSetupTokenModel.findById(id);
  }

  async findOne(
    filter: Record<string, unknown>,
  ): Promise<IProviderPasswordSetupToken | null> {
    return ProviderPasswordSetupTokenModel.findOne(filter);
  }

  async findAll(
    filter: Record<string, unknown> = {},
  ): Promise<IProviderPasswordSetupToken[]> {
    return ProviderPasswordSetupTokenModel.find(filter);
  }

  async updateById(
    id: string,
    data: Partial<IProviderPasswordSetupToken>,
  ): Promise<IProviderPasswordSetupToken | null> {
    return ProviderPasswordSetupTokenModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async updateOne(
    filter: Record<string, unknown>,
    data: Partial<IProviderPasswordSetupToken>,
  ): Promise<IProviderPasswordSetupToken | null> {
    return ProviderPasswordSetupTokenModel.findOneAndUpdate(filter, data, {
      new: true,
    });
  }

  async exists(filter: Record<string, unknown>): Promise<boolean> {
    return (await ProviderPasswordSetupTokenModel.exists(filter)) !== null;
  }

  async count(filter: Record<string, unknown> = {}): Promise<number> {
    return ProviderPasswordSetupTokenModel.countDocuments(filter);
  }

  async softDelete(_filter: Record<string, unknown>): Promise<boolean> {
    return false;
  }

  async restore(_filter: Record<string, unknown>): Promise<boolean> {
    return false;
  }

  async forceDelete(filter: Record<string, unknown>): Promise<boolean> {
    const result =
      await ProviderPasswordSetupTokenModel.findOneAndDelete(filter);

    return result !== null;
  }

  async upsertByProvider(
    providerId: string,
    token: string,
    expiresAt: Date,
  ): Promise<IProviderPasswordSetupToken> {
    return ProviderPasswordSetupTokenModel.findOneAndUpdate(
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
    return ProviderPasswordSetupTokenModel.findOne({
      provider: providerId,
    });
  }

  async deleteByProvider(providerId: string): Promise<boolean> {
    return this.forceDelete({
      provider: providerId,
    });
  }
}