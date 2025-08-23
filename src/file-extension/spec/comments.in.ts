// This is a comment about external packages
import { assertEquals } from "@std/assert";
import { join } from "@std/path";

// Local imports with .js should be converted to .ts
import { User } from "./models/user.js";

// Local imports with no extension should get .ts added
import { Logger } from "./utils/logger";
import { Config } from "./config/app";

// Local imports with .ts should remain unchanged
import { Helpers } from "./utils/helpers.ts";

export class CommentsTest {
  constructor(
    private userService: InstanceType<typeof User>,
    private logger: Logger,
    private config: typeof Config,
    private helpers: Helpers,
  ) {}

  async testComments() {
    // This comment should be preserved
    this.logger.info("Testing comment preservation");
    return await this.userService.findById("123");
  }
}
