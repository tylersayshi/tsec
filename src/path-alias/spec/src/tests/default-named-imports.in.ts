import UserController from "@controllers/user";
import { UserService } from "@services/user";
import { AuthConfig as _AuthConfig, AuthService } from "@services/auth";
import Logger, { LogLevel } from "@utils/logger";

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
