import { UserService } from "../services/user.js";
import { Logger } from "../utils/logger.js";
import { Config } from "../config/app.js";

export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private config: Config,
  ) {}

  getUser(id: string) {
    this.logger.info(`Fetching user ${id}`);
    return this.userService.findById(id);
  }
}
