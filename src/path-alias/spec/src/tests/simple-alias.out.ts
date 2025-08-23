import { UserService } from "../services/user";
import { Logger } from "../utils/logger";
import { Config } from "../config/app";

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
