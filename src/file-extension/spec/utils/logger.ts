export interface LogLevel {
  DEBUG: "debug";
  INFO: "info";
  WARN: "warn";
  ERROR: "error";
}

export class Logger {
  info(message: string, meta?: unknown): void {
    console.log(`[INFO] ${message}`, meta || "");
  }

  error(message: string, meta?: unknown): void {
    console.error(`[ERROR] ${message}`, meta || "");
  }

  warn(message: string, meta?: unknown): void {
    console.warn(`[WARN] ${message}`, meta || "");
  }

  debug(message: string, meta?: unknown): void {
    console.debug(`[DEBUG] ${message}`, meta || "");
  }
}
