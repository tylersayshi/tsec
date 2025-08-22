export interface DatabaseConnection {
  host: string;
  port: number;
  database: string;
}

export class Database {
  constructor(private connection: DatabaseConnection) {}

  async connect(): Promise<void> {
    console.log("Connected to database");
  }

  async disconnect(): Promise<void> {
    console.log("Disconnected from database");
  }
}