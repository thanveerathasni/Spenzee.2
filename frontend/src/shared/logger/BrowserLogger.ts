import type { ILogger, LogMetadata } from "./ILogger";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  metadata?: LogMetadata;
  timestamp: string;
}

export class BrowserLogger implements ILogger {
  debug(message: string, metadata?: LogMetadata): void {
    this.write("debug", message, metadata);
  }

  info(message: string, metadata?: LogMetadata): void {
    this.write("info", message, metadata);
  }

  warn(message: string, metadata?: LogMetadata): void {
    this.write("warn", message, metadata);
  }

  error(message: string, metadata?: LogMetadata): void {
    this.write("error", message, metadata);
  }

  private write(level: LogLevel, message: string, metadata?: LogMetadata): void {
    const entry: LogEntry = {
      level,
      message,
      metadata,
      timestamp: new Date().toISOString(),
    };

    window.dispatchEvent(new CustomEvent<LogEntry>("spenzee:log", { detail: entry }));
  }
}
