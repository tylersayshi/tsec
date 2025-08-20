import { UserService } from "../services/user.ts";
import { AuthService } from "../services/auth.ts";
import { Logger } from "../utils/logger.ts";
import { Database } from "../database/connection.ts";
import { Config } from "../config/app.ts";
import { ValidationError } from "../types/errors.ts";
import { UserModel } from "../models/user.ts";
import { AuthModel } from "../models/auth.ts";

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
