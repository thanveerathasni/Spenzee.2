import type { RequestHandler } from "express";

import { HTTP_STATUS } from "../shared/constants/status/httpStatus";
import { ERROR_MESSAGES } from "../shared/constants/messages/errorMessages";
import { AppError } from "../shared/errors/AppError";
import { UserRole } from "../shared/enums/UserRole";

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
