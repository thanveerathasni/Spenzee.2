import type { IProviderResetPasswordToken } from "../../../models/ProviderResetPasswordToken.model";
import type { IBaseRepository } from "../base/IBaseRepository";

export interface IProviderResetPasswordTokenRepository
  extends IBaseRepository<IProviderResetPasswordToken> {
  upsertByProvider(
    providerId: string,
    token: string,
    expiresAt: Date,
  ): Promise<IProviderResetPasswordToken>;

  findByProvider(
    providerId: string,
  ): Promise<IProviderResetPasswordToken | null>;

  deleteByProvider(providerId: string): Promise<boolean>;
}
