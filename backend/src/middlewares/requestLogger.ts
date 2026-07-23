import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type { ILogger } from "../shared/logger";

import { container } from "../container";
import { TYPES } from "../container/types";

const logger = container.get<ILogger>(TYPES.Logger);

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
    );
  });

  next();
}