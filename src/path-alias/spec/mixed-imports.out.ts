// Path aliases
import { UserService } from "../src/services/user.ts";
import { Logger } from "../src/utils/logger.ts";

// External packages
import express from "express";
import { z } from "zod";

// Relative imports
import { Helper } from "./helper";
import { Constants } from "../constants";

// Type imports
import type { UserType } from "../src/types/user.ts";

export class App {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private helper: Helper,
  ) {}

  async start() {
    this.logger.info("Starting app");
    const app = express();
    return app;
  }
}
