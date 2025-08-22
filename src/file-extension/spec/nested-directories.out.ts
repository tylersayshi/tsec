import { User } from "./models/user.ts";
import { AuthService } from "./services/auth/auth-service.ts";
import { Logger } from "./utils/logger/logger.ts";
import { Config } from "./config/database/connection.ts";
import { Types } from "./types/user/user-types.ts";
import { Helpers } from "./utils/helpers/string-utils.ts";

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
