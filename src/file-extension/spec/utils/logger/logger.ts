export interface LoggerConfig {
  level: "debug" | "info" | "warn" | "error";
  output: "console" | "file";
}

export class Logger {
  constructor(private config: LoggerConfig) {}

  info(message: string, meta?: unknown): void {
    console.log(`[INFO] ${message}`, meta || "");
  }

  error(message: string, meta?: unknown): void {
    console.error(`[ERROR] ${message}`, meta || "");
  }
}
