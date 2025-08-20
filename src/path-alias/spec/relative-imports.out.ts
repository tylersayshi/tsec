import { UserService } from "../src/services/user.ts";
import { Logger } from "./logger";
import { Config } from "../config/app";
import { Utils } from "../../utils/helpers";

export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private config: Config,
    private utils: Utils,
  ) {}

  async getUser(id: string) {
    this.logger.info(`Fetching user ${id}`);
    return this.userService.findById(id);
  }
}
