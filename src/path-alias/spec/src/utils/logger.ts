export class Logger {
  info(message: string) {
    console.log(message);
  }

  log(message: string, level: LogLevel) {
    console.log(`[${level}] ${message}`);
  }
}

export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

export default Logger;
