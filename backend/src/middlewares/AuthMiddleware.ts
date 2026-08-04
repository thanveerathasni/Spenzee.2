import type { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../container/types";
import type { IAuthMiddleware } from "../interfaces/middlewares/IAuthMiddleware";
import type { IJwtService } from "../interfaces/services/auth/IJwtService";
import { HTTP_STATUS } from "../shared/constants/status/httpStatus";
import { ERROR_MESSAGES } from "../shared/constants/messages/errorMessages";
import { LOG_MESSAGES } from "../shared/constants/messages/logMessages";
import { AppError } from "../shared/errors/AppError";
import type { ILogger } from "../shared/logger/ILogger";

@injectable()
export class AuthMiddleware implements IAuthMiddleware {
  constructor(
    @inject(TYPES.JwtService)
    private readonly jwtService: IJwtService,

    @inject(TYPES.Logger)
    private readonly logger: ILogger,
  ) {}

  authenticate = (req: Request, _res: Response, next: NextFunction): void => {
    const authorization = req.headers.authorization;

    if (!authorization) {
      this.logger.warn(LOG_MESSAGES.AUTH_TOKEN_MISSING, {
        path: req.originalUrl,
      });
      next(new AppError(ERROR_MESSAGES.AUTH_TOKEN_MISSING, HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    const [scheme, token, ...additionalParts] = authorization.trim().split(/\s+/);

    if (scheme !== "Bearer" || !token || additionalParts.length > 0) {
      this.logger.warn(LOG_MESSAGES.INVALID_TOKEN, {
        path: req.originalUrl,
        reason: "invalid authorization header format",
      });
      next(new AppError(ERROR_MESSAGES.INVALID_AUTH_HEADER, HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    try {
      req.user = this.jwtService.verifyAccessToken(token);
      next();
    } catch (error) {
      next(error);
    }
  };
}
