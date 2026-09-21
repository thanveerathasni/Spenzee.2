import { BrowserLogger } from "./BrowserLogger";

export type { ILogger, LogMetadata } from "./ILogger";

export const logger = new BrowserLogger();
