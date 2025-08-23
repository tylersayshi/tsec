// External packages should remain unchanged
import { assertEquals } from "@std/assert";
import { join } from "@std/path";
import { exists } from "@std/fs";

// Local imports with .js should be converted to .ts
import { User } from "./models/user.js";
import { Database } from "../database/connection.js";

// Local imports with no extension should get .ts added
import { AuthService } from "./services/auth";
import { Logger } from "./utils/logger";

// Local imports with .ts should remain unchanged
import { Types } from "./types/user.ts";

export class AppController {
  constructor(
    private userService: User,
    private db: Database,
    private auth: AuthService,
    private logger: Logger,
    private types: Types,
  ) {}

  async handleRequest(req: any, res: any) {
    this.logger.info("Handling request", { url: req.url });
    res.json(null);
  }
}
