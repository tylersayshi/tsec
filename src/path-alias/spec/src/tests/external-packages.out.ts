import { UserService } from "../services/user";
import { walk } from "@std/fs";
import { Logger } from "../utils/logger";

export class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {}

  getUser(id: string) {
    walk("test");
    this.logger.info(`Fetching user ${id}`);
    return this.userService.findById(id);
  }
}
