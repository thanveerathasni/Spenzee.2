import { injectable } from "inversify";

import type { IRefreshTokenRepository } from "../../interfaces/repositories/auth/IRefreshTokenRepository";
import type { IRefreshToken } from "../../models/RefreshToken.model";
import { RefreshTokenModel } from "../../models/RefreshToken.model";
import { BaseRepository } from "../base/BaseRepository";

@injectable()
export class RefreshTokenRepository
  extends BaseRepository<IRefreshToken>
  implements IRefreshTokenRepository
{
  constructor() {
    super(RefreshTokenModel);
  }

  // async store(
  //   refreshToken: Pick<IRefreshToken, "userId" | "userType" | "token" | "expiresAt">,
  // ): Promise<IRefreshToken> {
  //   return this.create(refreshToken);
  // }

async store(
  refreshToken: Pick<IRefreshToken, "userId" | "userType" | "token" | "expiresAt">,
): Promise<IRefreshToken> {

  const result = await this.model.create(refreshToken);


  return result;
}

  async findByToken(token: string): Promise<IRefreshToken | null> {
    return this.model.findOne({ token });
  }

  async deleteByToken(token: string): Promise<boolean> {
    return this.forceDelete({ token });
  }
}
