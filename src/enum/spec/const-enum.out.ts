const LogLevel = {
  Debug: 0,
  Info: 1,
  Warn: 2,
  Error: 3,
} as const;
type LogLevelType = typeof LogLevel[keyof typeof LogLevel];

function log(level: LogLevelType, message: string): void {
  if (level >= LogLevel.Info) {
    console.log(`[${level}] ${message}`);
  }
}

log(LogLevel.Error, "Something went wrong");
