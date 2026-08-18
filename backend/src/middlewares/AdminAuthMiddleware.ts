import { inject, injectable } from "inversify";

import { TYPES } from "../container/types";
import { ERROR_MESSAGES } from "../shared/constants/messages/errorMessages";
import { LOG_MESSAGES } from "../shared/constants/messages/logMessages";
import { HTTP_STATUS } from "../shared/constants/status/httpStatus";
import { UserRole } from "../shared/enums/UserRole";
import { AppError } from "../shared/errors/AppError";

import type { IAuthMiddleware } from "../interfaces/middlewares/IAuthMiddleware";
import type { IJwtService } from "../interfaces/services/auth/IJwtService";
import type { ILogger } from "../shared/logger/ILogger";
import type { NextFunction, Request, Response } from "express";

@injectable()
export class AdminAuthMiddleware implements IAuthMiddleware {
  constructor(
    @inject(TYPES.JwtService)
    private readonly _jwtService: IJwtService,

    @inject(TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  authenticate = (req: Request, _res: Response, next: NextFunction): void => {
    const authorization = req.headers.authorization;

    if (!authorization) {
      this._logger.warn(LOG_MESSAGES.AUTH_TOKEN_MISSING, {
        path: req.originalUrl,
      });

      next(new AppError(ERROR_MESSAGES.AUTH_TOKEN_MISSING, HTTP_STATUS.UNAUTHORIZED));

      return;
    }

    const [scheme, token, ...additionalParts] = authorization.trim().split(/\s+/);

    if (scheme !== "Bearer" || !token || additionalParts.length > 0) {
      this._logger.warn(LOG_MESSAGES.INVALID_TOKEN, {
        path: req.originalUrl,
        reason: "invalid authorization header format",
      });

      next(new AppError(ERROR_MESSAGES.INVALID_AUTH_HEADER, HTTP_STATUS.UNAUTHORIZED));

      return;
    }

    try {
      const user = this._jwtService.verifyAccessToken(token);

      if (user.role !== UserRole.ADMIN) {
        this._logger.warn(LOG_MESSAGES.INVALID_TOKEN, {
          path: req.originalUrl,
          reason: "admin access required",
          userId: user.userId,
          role: user.role,
        });

        next(new AppError(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN));

        return;
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
}
