import { UserService } from "@services/user";
import { AuthService } from "@services/auth";
import { Logger } from "@utils/logger";
import { Config } from "@config/app";

export class App {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private logger: Logger,
    private config: Config,
  ) {}

  start() {
    this.logger.info("Starting application");
  }
}
