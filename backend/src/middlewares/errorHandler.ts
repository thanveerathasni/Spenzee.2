import type { ErrorRequestHandler } from "express";

import { HTTP_STATUS, ERROR_MESSAGES } from "../shared/constants";
import { TYPES } from "../container/types";
import { container } from "../container/index";
import { AppError } from "../shared/errors";
import type { ILogger } from "../shared/logger/ILogger";
import { errorResponse } from "../shared/responses/errorResponse";

const logger = container.get<ILogger>(TYPES.Logger);
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    errorResponse(res, error.statusCode, error.message);
    return;
  }

  logger.error("Unhandled application error.", { error });
  errorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
};
