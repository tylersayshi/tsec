import { User } from "./models/user.js";
import { AuthService } from "./services/auth/auth-service.js";
import { Logger } from "./utils/logger/logger.js";
import { DatabaseConfig } from "./config/database/connection";
import { UserStatus } from "./types/user/user-types";
import { StringUtils } from "./utils/helpers/string-utils";

export class NestedDirectoryTest {
  constructor(
    private user: User,
    private auth: AuthService,
    private logger: Logger,
    private config: DatabaseConfig,
    private types: UserStatus,
    private helpers: StringUtils,
  ) {}

  async testNestedImports() {
    this.logger.info("Testing nested imports");
    return null;
  }
}
