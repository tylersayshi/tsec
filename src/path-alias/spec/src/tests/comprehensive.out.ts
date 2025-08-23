// Type-only imports
import type { UserType } from "../types/user";
import type { ConfigType as _ConfigType } from "../config/types";

// Regular imports with path aliases
import { UserService } from "../services/user";
import { AuthService } from "../services/auth";
import { Logger } from "../utils/logger";

// External packages (should be preserved)
import { walk } from "@std/fs";

// Relative imports (should be preserved)
import { Utils } from "../utils/helpers";

// Wildcard imports
import { ValidationError as _ValidationError } from "../types/errors";

// Re-exports
export { UserService } from "../services/user";
export { AuthService } from "../services/auth";

// Default imports
import _UserController from "../controllers/user";

export class App {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private logger: Logger,
    private utils: Utils,
  ) {}

  async initialize() {
    this.logger.info("Initializing application");
    await this.db.connect();
  }

  createUser(userData: UserType) {
    walk("test");
    return this.userService.create(userData);
  }
}
