enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

enum Environment {
  Development = "development",
  Staging = "staging",
  Production = "production",
}

interface AppConfig {
  environment: Environment;
  logLevel: LogLevel;
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

  setEnvironment(env: Environment): void {
    this.config.environment = env;
    
    if (env === Environment.Production) {
      this.config.logLevel = LogLevel.ERROR;
      this.config.port = 8080;
    } else if (env === Environment.Staging) {
      this.config.logLevel = LogLevel.WARN;
      this.config.port = 4000;
    }
  }

  setLogLevel(level: LogLevel): void {
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