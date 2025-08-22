// External packages should remain unchanged
import express from "express";
import { Request, Response } from "express";
import axios from "axios";

// Local imports with .js should be converted to .ts
import { User } from "./models/user.js";
import { Database } from "../database/connection.js";

// Local imports with no extension should get .ts added
import { AuthService } from "./services/auth";
import { Logger } from "./utils/logger";

// Local imports with .ts should remain unchanged
import { Config } from "./config/app.ts";
import { Types } from "./types/user.ts";

export class AppController {
  constructor(
    private userService: User,
    private db: Database,
    private auth: AuthService,
    private logger: Logger,
    private config: Config,
    private types: Types,
  ) {}

  async handleRequest(req: Request, res: Response) {
    this.logger.info("Handling request", { url: req.url });
    const user = await this.userService.findById(req.params.id);
    res.json(user);
  }
}
