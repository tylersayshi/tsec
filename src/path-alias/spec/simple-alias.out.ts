import { UserService } from "../src/path-alias/spec/src/services/user.ts";
import { Logger } from "../src/path-alias/spec/src/utils/logger.ts";
import { Config } from "../src/path-alias/spec/src/config/app.ts";

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
