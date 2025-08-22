// This is a comment about external packages
import { assertEquals } from "@std/assert";
import { join } from "@std/path";

// Local imports with .js should be converted to .ts
import { User } from "./models/user.ts";
import { Database } from "../database/connection.ts";

// Local imports with no extension should get .ts added
import { Logger } from "./utils/logger.ts";
import { Config } from "./config/app.ts";

// Local imports with .ts should remain unchanged
import { Helpers } from "./utils/helpers.ts";

export class CommentsTest {
  constructor(
    private userService: User,
    private db: Database,
    private logger: Logger,
    private config: typeof Config,
    private helpers: Helpers,
  ) {}

  async testComments() {
    // This comment should be preserved
    this.logger.info("Testing comment preservation");
    return this.userService.email;
  }
}
