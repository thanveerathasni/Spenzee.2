import { injectable } from "inversify";

import { RefreshTokenModel } from "../../models/RefreshToken.model";
import { BaseRepositoryWithoutSoftDelete } from "../base/BaseRepositoryWithoutSoftDelete";

import type { IRefreshTokenRepository } from "../../interfaces/repositories/auth/IRefreshTokenRepository";
import type { IRefreshToken } from "../../models/RefreshToken.model";

@injectable()
export class RefreshTokenRepository
  extends BaseRepositoryWithoutSoftDelete<IRefreshToken>
  implements IRefreshTokenRepository
{
  constructor() {
    super(RefreshTokenModel);
  }

  async store(
    refreshToken: Pick<
      IRefreshToken,
      "userId" | "userType" | "token" | "expiresAt"
    >,
  ): Promise<IRefreshToken> {
    return this.create(refreshToken);
  }

  async findByToken(token: string): Promise<IRefreshToken | null> {
    return this.model.findOne({ token });
  }

  async deleteByToken(token: string): Promise<boolean> {
    return this.forceDelete({ token });
  }

  async deleteByUserId(userId: string): Promise<number> {
    const result = await this.model.deleteMany({
      userId,
    });

    return result.deletedCount;
  }
}