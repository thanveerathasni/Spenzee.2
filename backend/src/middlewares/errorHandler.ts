
import { container } from "../container/index";
import { TYPES } from "../container/types";
import { HTTP_STATUS, ERROR_MESSAGES } from "../shared/constants";
import { AppError } from "../shared/errors";
import { errorResponse } from "../shared/responses/errorResponse";

import type { ILogger } from "../shared/logger/ILogger";
import type { ErrorRequestHandler } from "express";

const logger = container.get<ILogger>(TYPES.Logger);

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    errorResponse(res, error.statusCode, error.message);
    return;
  }

  if (error instanceof Error) {
    logger.error("Unhandled application error.", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  } else {
    logger.error("Unhandled application error.", {
      error,
    });
  }

  errorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
};
