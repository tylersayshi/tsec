import { User } from "./models/user.js";
import { AuthService } from "./services/auth/auth-service.js";
import { Logger } from "./utils/logger/logger.js";
import { Config } from "./config/database/connection";
import { Types } from "./types/user/user-types";
import { Helpers } from "./utils/helpers/string-utils";

export class NestedDirectoryTest {
  constructor(
    private user: User,
    private auth: AuthService,
    private logger: Logger,
    private config: Config,
    private types: Types,
    private helpers: Helpers,
  ) {}

  async testNestedImports() {
    this.logger.info("Testing nested imports");
    return this.helpers.formatString("test");
  }
}
