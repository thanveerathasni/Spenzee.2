
import { ERROR_MESSAGES } from "../shared/constants/messages/errorMessages";
import { HTTP_STATUS } from "../shared/constants/status/httpStatus";
import { type UserRole } from "../shared/enums/UserRole";
import { AppError } from "../shared/errors/AppError";

import type { RequestHandler } from "express";

export const authorize = (...roles: UserRole[]): RequestHandler => {
  return (req, _res, next): void => {
    if (!req.user) {
      next(new AppError(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN));
      return;
    }

    next();
  };
};
