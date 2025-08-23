import { User } from "./models/user";
import { Logger } from "./utils/logger";
import { Types } from "./types/user";

export class UserController {
  constructor(
    private userService: User,
    private logger: Logger,
    private types: Types,
  ) {}

  async getUser(id: string) {
    this.logger.info("Getting user", { id });
    return null;
  }
}
