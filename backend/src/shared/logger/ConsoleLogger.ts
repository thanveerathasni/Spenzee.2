import { injectable } from "inversify";

import type { ILogger } from "./ILogger";

@injectable()
export class ConsoleLogger implements ILogger {
  info(message: string, meta?: unknown): void {
    console.log(`[INFO] ${message}`, meta ?? "");
  }

  warn(message: string, meta?: unknown): void {
    console.warn(`[WARN] ${message}`, meta ?? "");
  }

  error(message: string, meta?: unknown): void {
    console.error(`[ERROR] ${message}`, meta ?? "");
  }

  debug(message: string, meta?: unknown): void {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[DEBUG] ${message}`, meta ?? "");
    }
  }
}