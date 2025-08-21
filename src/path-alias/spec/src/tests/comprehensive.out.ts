// Type-only imports
import type { UserType } from "../types/user";
import type { ConfigType } from "../config/types";

// Regular imports with path aliases
import { UserService } from "../services/user";
import { AuthService } from "../services/auth";
import { Logger } from "../utils/logger";
import { Database } from "../database/connection";

// External packages (should be preserved)
import express from "express";
import { z } from "zod";

// Relative imports (should be preserved)
import { Helper } from "./helper";
import { Constants } from "../constants";

// Wildcard imports
import { UserModel } from "../models/index";
import { ValidationError } from "../types/errors";

// Re-exports
export { UserService } from "../services/user";
export { AuthService } from "../services/auth";

// Default imports
import UserController from "../controllers/user";

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
