import UserController from "../controllers/user";
import { UserService } from "../services/user";
import { AuthConfig, AuthService } from "../services/auth";
import Logger, { LogLevel } from "../utils/logger";

export class App {
  constructor(
    private userController: UserController,
    private userService: UserService,
    private authService: AuthService,
    private logger: Logger,
  ) {}

  async start() {
    this.logger.info("Starting application");
    return this.userService.findAll();
  }
}
