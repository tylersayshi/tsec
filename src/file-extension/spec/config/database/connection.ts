export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export class Connection {
  constructor(private config: DatabaseConfig) {}

  async connect(): Promise<void> {
    console.log("Database connected");
  }

  async disconnect(): Promise<void> {
    console.log("Database disconnected");
  }
}
