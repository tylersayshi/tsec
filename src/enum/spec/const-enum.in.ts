const enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
}

function log(level: LogLevel, message: string): void {
  if (level >= LogLevel.Info) {
    console.log(`[${level}] ${message}`);
  }
}

log(LogLevel.Error, "Something went wrong");
