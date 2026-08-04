import { randomUUID } from "node:crypto";

import { injectable } from "inversify";
import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
  type JwtPayload as JsonWebTokenPayload,
  type SignOptions,
} from "jsonwebtoken";

import { env } from "../../config/env";
import { TYPES } from "../../container/types";
import type {
  DecodedTokenPayload,
  GeneratedRefreshToken,
  IJwtService,
  JwtPayload,
} from "../../interfaces/services/auth/IJwtService";
import { HTTP_STATUS } from "../../shared/constants/status/httpStatus";
import { ERROR_MESSAGES } from "../../shared/constants/messages/errorMessages";
import { LOG_MESSAGES } from "../../shared/constants/messages/logMessages";
import { AppError } from "../../shared/errors/AppError";
import { UserRole } from "../../shared/enums/UserRole";
import type { ILogger } from "../../shared/logger/ILogger";
import { inject } from "inversify";

@injectable()
export class JwtService implements IJwtService {
  constructor(
    @inject(TYPES.Logger)
    private readonly logger: ILogger,
  ) {}

  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
    } as SignOptions);
  }

  generateRefreshToken(payload: JwtPayload): GeneratedRefreshToken {
    const token = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
      jwtid: randomUUID(),
    } as SignOptions);

    return {
      token,
      expiresAt: this.getExpiration(token),
    };
  }

  verifyAccessToken(token: string): DecodedTokenPayload {
    return this.verify(token, env.JWT_ACCESS_SECRET);
  }

  verifyRefreshToken(token: string): DecodedTokenPayload {
    return this.verify(token, env.JWT_REFRESH_SECRET);
  }

  decodeToken(token: string): DecodedTokenPayload | null {
    const decoded = jwt.decode(token);

    return this.toDecodedPayload(decoded);
  }

  private verify(token: string, secret: string): DecodedTokenPayload {
    let decoded: string | JsonWebTokenPayload;

    try {
      decoded = jwt.verify(token, secret);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        this.logger.warn(LOG_MESSAGES.TOKEN_EXPIRED, {
          expiredAt: error.expiredAt,
        });
        throw new AppError(ERROR_MESSAGES.TOKEN_EXPIRED, HTTP_STATUS.UNAUTHORIZED);
      }

      if (error instanceof JsonWebTokenError || error instanceof NotBeforeError) {
        this.logger.warn(LOG_MESSAGES.INVALID_TOKEN, {
          reason: error.message,
        });
        throw new AppError(ERROR_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
      }

      this.logger.error(LOG_MESSAGES.INVALID_TOKEN, { error });
      throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    const payload = this.toDecodedPayload(decoded);

    if (!payload) {
      this.logger.warn(LOG_MESSAGES.INVALID_TOKEN, {
        reason: "required JWT claims are missing",
      });
      throw new AppError(ERROR_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }

    return payload;
  }

  private getExpiration(token: string): Date {
    const payload = this.decodeToken(token);

    if (!payload?.exp) {
      this.logger.error(LOG_MESSAGES.INVALID_TOKEN, {
        reason: "refresh token does not contain an expiration claim",
      });
      throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    return new Date(payload.exp * 1000);
  }

  private toDecodedPayload(
    payload: string | JsonWebTokenPayload | null,
  ): DecodedTokenPayload | null {
    if (
      !payload ||
      typeof payload === "string" ||
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      !Object.values(UserRole).includes(payload.role as UserRole)
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role as UserRole,
      iat: payload.iat,
      exp: payload.exp,
    };
  }
}
