import { LogLevel, Environment, ConfigManager } from './config.in.ts';

class Logger {
  private configManager: ConfigManager;
  private name: string;

  constructor(name: string, configManager: ConfigManager) {
    this.name = name;
    this.configManager = configManager;
  }

  private shouldLog(level: LogLevel): boolean {
    const config = this.configManager.getConfig();
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(config.logLevel);
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    const env = this.configManager.getConfig().environment;
    return `[${timestamp}] [${env.toUpperCase()}] [${level.toUpperCase()}] ${this.name}: ${message}`;
  }

  debug(message: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage(LogLevel.DEBUG, message));
    }
  }

  info(message: string): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(this.formatMessage(LogLevel.INFO, message));
    }
  }

  warn(message: string): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message));
    }
  }

  error(message: string): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage(LogLevel.ERROR, message));
    }
  }
}

// Usage example
const configManager = new ConfigManager();
configManager.setLogLevel(LogLevel.INFO);

const appLogger = new Logger('App', configManager);
const dbLogger = new Logger('Database', configManager);

appLogger.debug('This will not be logged');
appLogger.info('Application starting');
appLogger.warn('Low memory warning');

dbLogger.error('Connection failed');

// Test different environments
configManager.setEnvironment(Environment.Production);
appLogger.info('Running in production mode');