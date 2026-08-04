import type { IRefreshToken } from "../../../models/RefreshToken.model";
import type { IBaseRepository } from "../base/IBaseRepository";

export interface IRefreshTokenRepository extends IBaseRepository<IRefreshToken> {
  store(
    refreshToken: Pick<IRefreshToken, "userId" | "userType" | "token" | "expiresAt">,
  ): Promise<IRefreshToken>;

  findByToken(token: string): Promise<IRefreshToken | null>;

  deleteByToken(token: string): Promise<boolean>;
}
