// Path aliases
import { UserService } from "@services/user";
import { Logger } from "@utils/logger";

// External packages
import express from "express";
import { z } from "zod";

// Relative imports
import { Helper } from "./helper";
import { Constants } from "../constants";

// Type imports
import type { UserType } from "@types/user";

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
