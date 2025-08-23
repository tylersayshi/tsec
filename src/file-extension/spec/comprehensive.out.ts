// External packages should remain unchanged
import { assertEquals } from "@std/assert";
import { join } from "@std/path";
import { exists } from "@std/fs";
import { Project } from "ts-morph";

// Local imports with .js should be converted to .ts
import { User } from "./models/user.ts";
import { Database } from "../database/connection.ts";

// Local imports with no extension should get .ts added
import { Logger } from "./utils/logger.ts";
import { Config } from "./config/app.ts";
import { Types } from "./types/user.ts";

// Local imports with .ts should remain unchanged
import { Helpers } from "./utils/helpers.ts";
import { Constants } from "./constants.ts";

// Index file imports
import { Models } from "./models/index.ts";
import { Utils } from "./utils/index.ts";
import { Configs } from "./config/index.ts";

// Nested directory imports
import { UserService } from "./services/user/user-service.ts";
import { AuthConfig } from "./config/auth/auth-config.ts";
import { LoggerConfig } from "./config/logger/logger-config.ts";

export class ComprehensiveTest {
  constructor(
    private user: InstanceType<typeof User>,
    private db: Database,
    private logger: Logger,
    private config: typeof Config,
    private types: Types,
    private helpers: Helpers,
    private constants: Constants,
    private models: Models,
    private utils: Utils,
    private configs: Configs,
    private userService: UserService,
    private authConfig: AuthConfig,
    private loggerConfig: LoggerConfig,
  ) {}

  async testComprehensive() {
    this.logger.info("Testing comprehensive file extension transformation");

    const project = new Project();
    const user = await this.userService.findById("123");

    return {
      user,
      project,
      config: this.config,
      helpers: this.helpers.formatString("test"),
    };
  }
}
