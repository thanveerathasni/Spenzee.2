import { type NextFunction, type Request, type Response } from "express";
import { AppError } from "../errors/AppError.js";
import { HTTP_STATUS } from "../shared/constants/httpStatus.js";
import { ERROR_MESSAGES } from "../constants/messages.js";

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  console.error(error);

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  });
};
