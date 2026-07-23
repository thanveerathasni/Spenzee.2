import type {
  ErrorRequestHandler,
} from "express";

import {
  HTTP_STATUS,
  ERROR_MESSAGES,
} from "../shared/constants";

import {
  AppError,
} from "../shared/errors";

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

  console.error(error);

  res.status(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
  ).json({
    success: false,
    message:
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  });
};