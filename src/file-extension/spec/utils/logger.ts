export interface LogLevel {
  DEBUG: "debug";
  INFO: "info";
  WARN: "warn";
  ERROR: "error";
}

export class Logger {
  info(message: string, meta?: any): void {
    console.log(`[INFO] ${message}`, meta || "");
  }

  error(message: string, meta?: any): void {
    console.error(`[ERROR] ${message}`, meta || "");
  }

  warn(message: string, meta?: any): void {
    console.warn(`[WARN] ${message}`, meta || "");
  }

  debug(message: string, meta?: any): void {
    console.debug(`[DEBUG] ${message}`, meta || "");
  }
}