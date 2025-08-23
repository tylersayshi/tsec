export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export class Connection {
  constructor(private config: DatabaseConfig) {}

  connect(): Promise<void> {
    console.log("Database connected");
    return Promise.resolve();
  }

  disconnect(): Promise<void> {
    console.log("Database disconnected");
    return Promise.resolve();
  }
}
