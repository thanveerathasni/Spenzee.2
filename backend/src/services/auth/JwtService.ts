import jwt, { type SignOptions } from "jsonwebtoken";
import { injectable } from "inversify";

import { env } from "../../config/env";
import type {
  GeneratedRefreshToken,
  IJwtService,
  JwtPayload,
} from "../../interfaces/services/auth/IJwtService";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

@injectable()
export class JwtService implements IJwtService {
  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    } as SignOptions);
  }

  generateRefreshToken(payload: JwtPayload): GeneratedRefreshToken {
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    return {
      token: jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: `${REFRESH_TOKEN_EXPIRY_DAYS}d`,
      } as SignOptions),
      expiresAt,
    };
  }
}
