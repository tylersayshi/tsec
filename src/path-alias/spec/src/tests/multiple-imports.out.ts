import { UserService } from "../services/user.ts";
import { AuthService } from "../services/auth.ts";
import { Logger } from "../utils/logger.ts";
import { Config } from "../config/app.ts";
import { Database } from "../database/connection.ts";

export class App {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private logger: Logger,
    private config: Config,
    private db: Database,
  ) {}

  async start() {
    this.logger.info("Starting application");
    await this.db.connect();
  }
}
