import { User } from "./models/user.ts";
import { Logger } from "./utils/logger.ts";

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
