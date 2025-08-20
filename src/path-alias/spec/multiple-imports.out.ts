import { UserService } from "../src/services/user.ts";
import { AuthService } from "../src/services/auth.ts";
import { Logger } from "../src/utils/logger.ts";
import { Config } from "../src/config/app.ts";
import { Database } from "../src/database/connection.ts";

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
