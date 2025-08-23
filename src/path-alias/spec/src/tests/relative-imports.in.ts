import { UserService } from "@services/user";
import { Logger } from "../utils/logger";
import { Config } from "../config/app";
import { Utils } from "../utils/helpers";

export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private config: Config,
    private utils: Utils,
  ) {}

  getUser(id: string) {
    this.logger.info(`Fetching user ${id}`);
    return this.userService.findById(id);
  }
}
