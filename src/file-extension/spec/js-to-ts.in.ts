import { User } from "./models/user.js";
import { Logger } from "./utils/logger.js";

export class UserController {
  constructor(
    private userService: User,
    private logger: Logger,
  ) {}

  async getUser(id: string) {
    this.logger.info("Getting user", { id });
    return await this.userService.email;
  }
}
