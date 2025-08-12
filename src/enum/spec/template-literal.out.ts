const LogLevel = {
  Debug: "Debug",
  Info: "Info",
  Warning: "Warning",
  Error: "Error",
} as const;
type LogLevelType = typeof LogLevel[keyof typeof LogLevel];

const Environment = {
  Development: "dev",
  Staging: "staging",
  Production: "prod",
} as const;
type EnvironmentType = typeof Environment[keyof typeof Environment];

class Logger {
  constructor(
    private level: LogLevelType = LogLevel.Info,
    private env: EnvironmentType = Environment.Development,
  ) {}

  log(level: LogLevelType, message: string): void {
    if (level >= this.level) {
      const prefix = `[${this.env || this.env}][${LogLevel[level]}]`;
      console.log(`${prefix} ${message}`);
    }
  }

  debug(msg: string) {
    this.log(LogLevel.Debug, msg);
  }
  info(msg: string) {
    this.log(LogLevel.Info, msg);
  }
  warn(msg: string) {
    this.log(LogLevel.Warning, msg);
  }
  error(msg: string) {
    this.log(LogLevel.Error, msg);
  }
}

function getLogLevelName(level: LogLevelType): string {
  return level === LogLevel.Debug
    ? "Debug Mode"
    : level === LogLevel.Info
    ? "Information"
    : level === LogLevel.Warning
    ? "Warning!"
    : level === LogLevel.Error
    ? "ERROR!"
    : "Unknown";
}

const logger = new Logger(
  LogLevel.Warning,
  Environment.Production,
);

const isProduction = logger["env"] === Environment.Production;
const isDevelopment = logger["env"] === Environment.Development;

logger.error(`Critical error in ${Environment.Production} environment`);
