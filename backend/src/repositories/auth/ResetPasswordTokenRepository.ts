import { injectable } from "inversify";

import { ResetPasswordTokenModel } from "../../models/ResetPasswordToken.model";
import { BaseRepository } from "../base/BaseRepository";

import type { IResetPasswordTokenRepository } from "../../interfaces/repositories/auth/IResetPasswordTokenRepository";
import type { IResetPasswordToken } from "../../models/ResetPasswordToken.model";

@injectable()
export class ResetPasswordTokenRepository
  extends BaseRepository<IResetPasswordToken>
  implements IResetPasswordTokenRepository
{
  constructor() {
    super(ResetPasswordTokenModel);
  }

  async upsertByEmail(email: string, token: string, expiresAt: Date): Promise<IResetPasswordToken> {
    return this.model.findOneAndUpdate(
      { email },
      { token, expiresAt },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
  }

  async findByEmail(email: string): Promise<IResetPasswordToken | null> {
    return this.model.findOne({ email });
  }

  async deleteByEmail(email: string): Promise<boolean> {
    return this.forceDelete({ email });
  }
}
