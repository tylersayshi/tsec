export interface AppConfig {
  port: number;
  host: string;
  environment: "development" | "production" | "test";
  database: {
    host: string;
    port: number;
    name: string;
  };
}

export const Config: AppConfig = {
  port: 3000,
  host: "localhost",
  environment: "development",
  database: {
    host: "localhost",
    port: 5432,
    name: "test_db",
  },
};

export type ConfigType = typeof Config;
