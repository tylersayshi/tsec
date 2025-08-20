import { UserService } from "../src/services/user.ts";
import { AuthService } from "../src/services/auth.ts";
import { Logger } from "../src/utils/logger.ts";
import { Database } from "../src/database/connection.ts";
import { Config } from "../src/config/app.ts";
import { ValidationError } from "../src/types/errors.ts";
import { UserModel } from "../src/models/user.ts";
import { AuthModel } from "../src/models/auth.ts";

export class App {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private logger: Logger,
    private db: Database,
    private config: Config,
  ) {}

  async initialize() {
    this.logger.info("Initializing application");
    await this.db.connect();
  }
}
