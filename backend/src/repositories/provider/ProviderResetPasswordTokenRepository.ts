import { injectable } from "inversify";

import { ProviderResetPasswordTokenModel } from "../../models/ProviderResetPasswordToken.model";

import type { IProviderResetPasswordTokenRepository } from "../../interfaces/repositories/provider/IProviderResetPasswordTokenRepository";
import type { IProviderResetPasswordToken } from "../../models/ProviderResetPasswordToken.model";

@injectable()
export class ProviderResetPasswordTokenRepository
  implements IProviderResetPasswordTokenRepository
{
  async create(
    data: Partial<IProviderResetPasswordToken>,
  ): Promise<IProviderResetPasswordToken> {
    return ProviderResetPasswordTokenModel.create(data);
  }

  async findById(
    id: string,
  ): Promise<IProviderResetPasswordToken | null> {
    return ProviderResetPasswordTokenModel.findById(id);
  }

  async findOne(
    filter: Record<string, unknown>,
  ): Promise<IProviderResetPasswordToken | null> {
    return ProviderResetPasswordTokenModel.findOne(filter);
  }

  async findAll(
    filter: Record<string, unknown> = {},
  ): Promise<IProviderResetPasswordToken[]> {
    return ProviderResetPasswordTokenModel.find(filter);
  }

  async updateById(
    id: string,
    data: Partial<IProviderResetPasswordToken>,
  ): Promise<IProviderResetPasswordToken | null> {
    return ProviderResetPasswordTokenModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async updateOne(
    filter: Record<string, unknown>,
    data: Partial<IProviderResetPasswordToken>,
  ): Promise<IProviderResetPasswordToken | null> {
    return ProviderResetPasswordTokenModel.findOneAndUpdate(filter, data, {
      new: true,
    });
  }

  async exists(filter: Record<string, unknown>): Promise<boolean> {
    return (await ProviderResetPasswordTokenModel.exists(filter)) !== null;
  }

  async count(filter: Record<string, unknown> = {}): Promise<number> {
    return ProviderResetPasswordTokenModel.countDocuments(filter);
  }

  async softDelete(_filter: Record<string, unknown>): Promise<boolean> {
    return false;
  }

  async restore(_filter: Record<string, unknown>): Promise<boolean> {
    return false;
  }

  async forceDelete(filter: Record<string, unknown>): Promise<boolean> {
    const result = await ProviderResetPasswordTokenModel.findOneAndDelete(filter);
    return result !== null;
  }

  async upsertByProvider(
    providerId: string,
    token: string,
    expiresAt: Date,
  ): Promise<IProviderResetPasswordToken> {
    return ProviderResetPasswordTokenModel.findOneAndUpdate(
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
    return ProviderResetPasswordTokenModel.findOne({
      provider: providerId,
    });
  }

  async deleteByProvider(providerId: string): Promise<boolean> {
    return this.forceDelete({ provider: providerId });
  }
}
