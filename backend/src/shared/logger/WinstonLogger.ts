import { injectable } from "inversify";
import { createLogger, format, transports } from "winston";

import type { ILogger } from "./ILogger";

const { combine, timestamp, printf } = format;

@injectable()
export class WinstonLogger implements ILogger {
    private readonly logger = createLogger({
        level: process.env.NODE_ENV === "production" ? "info" : "debug",

        format: combine(
            timestamp(),
            printf(({ timestamp, level, message }) => {
                return `${timestamp} [${level.toUpperCase()}] ${message}`;
            }),
        ),

        transports: [
            new transports.Console(),

            new transports.File({
                filename: "logs/error.log",
                level: "error",
            }),

            new transports.File({
                filename: "logs/combined.log",
            }),
        ],
    });

    info(message: string, meta?: unknown): void {
        this.logger.info(message, meta);
    }

    warn(message: string, meta?: unknown): void {
        this.logger.warn(message, meta);
    }

    error(message: string, meta?: unknown): void {
        this.logger.error(message, meta);
    }

    debug(message: string, meta?: unknown): void {
        this.logger.debug(message, meta);
    }
}