import type { Response } from "express";

export function errorResponse(
  res: Response,
  statusCode: number,
  message: string,
  errors?: unknown,
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors !== undefined && { errors }),
  });
}
