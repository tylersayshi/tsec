import { UserService } from "../services/user";
import { AuthService } from "../services/auth";
import { Logger } from "../utils/logger";
import { Config } from "../config/app";
import { ValidationError as _ValidationError } from "../types/errors";
import { UserModel as _UserModel } from "../models/user";
import { AuthModel as _AuthModel } from "../models/auth";

export class App {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private logger: Logger,
    private config: Config,
  ) {}

  initialize() {
    this.logger.info("Initializing application");
  }
}
