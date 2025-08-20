import { UserService } from "../../src/services/user.ts";
import { Logger } from "../../src/utils/logger.ts";
import { Config } from "../../src/config/app.ts";

export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private config: Config,
  ) {}

  async getUser(id: string) {
    this.logger.info(`Fetching user ${id}`);
    return this.userService.findById(id);
  }
}
