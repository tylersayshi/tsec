import UserController from "../controllers/user.ts";
import { UserService } from "../services/user.ts";
import { AuthConfig, AuthService } from "../services/auth.ts";
import Logger, { LogLevel } from "../utils/logger.ts";

export class App {
  constructor(
    private userController: UserController,
    private userService: UserService,
    private authService: AuthService,
    private logger: Logger,
  ) {}

  async start() {
    this.logger.log("Starting app", LogLevel.INFO);
    await this.authService.initialize();
  }
}
