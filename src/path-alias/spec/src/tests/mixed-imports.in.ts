// Path aliases
import { UserService } from "@services/user";
import { Logger } from "@utils/logger";

// External package import (should be preserved)
import { walk } from "@std/fs";

// Relative import (should be preserved)
import { Utils } from "../utils/helpers";

// Type imports
import type { UserType } from "@types/user";

// Default import
import UserController from "../controllers/user";

export class App {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private utils: Utils,
  ) {}

  async start() {
    this.logger.info("Starting app");
    walk("test");
  }
}
