
import { ZodError } from "zod";

import { ERROR_MESSAGES } from "../shared/constants/messages/errorMessages";
import { HTTP_STATUS } from "../shared/constants/status/httpStatus";
import { errorResponse } from "../shared/responses/errorResponse";

import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        errorResponse(res, HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.VALIDATION_FAILED, error.issues);
        return;
      }

      next(error);
    }
  };
