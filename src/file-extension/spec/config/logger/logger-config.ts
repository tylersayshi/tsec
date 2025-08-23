export interface LoggerSettings {
  level: "debug" | "info" | "warn" | "error";
  format: "json" | "text";
  output: "console" | "file";
}

export class LoggerConfig {
  static readonly defaultSettings: LoggerSettings = {
    level: "info",
    format: "text",
    output: "console",
  };
}
