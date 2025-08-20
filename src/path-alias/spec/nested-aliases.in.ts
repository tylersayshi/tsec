import { UserService } from "@services/user";
import { AuthService } from "@services/auth";
import { Logger } from "@utils/logger";
import { Database } from "@database/connection";
import { Config } from "@config/app";
import { ValidationError } from "@types/errors";
import { UserModel } from "@models/user";
import { AuthModel } from "@models/auth";

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
