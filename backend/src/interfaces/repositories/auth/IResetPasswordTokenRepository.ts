import type { IResetPasswordToken } from "../../../models/ResetPasswordToken.model";
import type { IBaseRepository } from "../base/IBaseRepository";

export interface IResetPasswordTokenRepository extends IBaseRepository<IResetPasswordToken> {
  upsertByEmail(email: string, token: string, expiresAt: Date): Promise<IResetPasswordToken>;
}
