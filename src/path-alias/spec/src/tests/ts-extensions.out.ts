import { UserService } from "../services/user.ts";
import { Logger } from "../utils/logger.ts";
import { Config } from "../config/app.ts";

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
