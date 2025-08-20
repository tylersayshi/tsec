// Type-only imports
import type { UserType } from "../src/types/user.ts";
import type { ConfigType } from "../src/config/types.ts";

// Regular imports with path aliases
import { UserService } from "../src/services/user.ts";
import { AuthService } from "../src/services/auth.ts";
import { Logger } from "../src/utils/logger.ts";
import { Database } from "../src/database/connection.ts";

// External packages (should be preserved)
import express from "express";
import { z } from "zod";

// Relative imports (should be preserved)
import { Helper } from "./helper";
import { Constants } from "../constants";

// Wildcard imports
import { UserModel } from "../src/models/index.ts";
import { ValidationError } from "../src/types/errors.ts";

// Re-exports
export { UserService } from "../src/services/user.ts";
export { AuthService } from "../src/services/auth.ts";

// Default imports
import UserController from "../src/controllers/user.ts";

export class App {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private logger: Logger,
    private db: Database,
    private helper: Helper,
  ) {}

  async initialize() {
    this.logger.info("Initializing application");
    await this.db.connect();
  }

  async createUser(userData: UserType) {
    const validationSchema = z.object({
      name: z.string(),
      email: z.string().email(),
    });

    const validatedData = validationSchema.parse(userData);
    return this.userService.create(validatedData);
  }
}
