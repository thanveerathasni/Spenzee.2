import type {
  ErrorRequestHandler,
} from "express";

import {
  HTTP_STATUS,
  ERROR_MESSAGES,
} from "../shared/constants";
import { TYPES } from "../container/types";
import {container} from "../container/index";
import {
  AppError,
} from "../shared/errors";
import { ILogger } from "../shared/logger/ILogger";
const logger = container.get<ILogger>(TYPES.Logger);
export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

logger.error(error, "Unhandled application error.");
  res.status(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
  ).json({
    success: false,
    message:
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  });
};