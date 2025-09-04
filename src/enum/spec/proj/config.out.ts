const LogLevel = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
} as const;
type LogLevelType = typeof LogLevel[keyof typeof LogLevel];

const Environment = {
  Development: "development",
  Staging: "staging",
  Production: "production",
} as const;
type EnvironmentType = typeof Environment[keyof typeof Environment];

interface AppConfig {
  environment: EnvironmentType;
  logLevel: LogLevelType;
  port: number;
  databaseUrl?: string;
}

class ConfigManager {
  private config: AppConfig;

  constructor() {
    this.config = {
      environment: Environment.Development,
      logLevel: LogLevel.INFO,
      port: 3000,
    };
  }

  setEnvironment(env: EnvironmentType): void {
    this.config.environment = env;
    
    if (env === Environment.Production) {
      this.config.logLevel = LogLevel.ERROR;
      this.config.port = 8080;
    } else if (env === Environment.Staging) {
      this.config.logLevel = LogLevel.WARN;
      this.config.port = 4000;
    }
  }

  setLogLevel(level: LogLevelType): void {
    this.config.logLevel = level;
  }

  getConfig(): Readonly<AppConfig> {
    return { ...this.config };
  }

  isProduction(): boolean {
    return this.config.environment === Environment.Production;
  }
}

const configManager = new ConfigManager();
configManager.setEnvironment(Environment.Staging);
configManager.setLogLevel(LogLevel.DEBUG);

export { LogLevel, Environment, ConfigManager, type AppConfig };