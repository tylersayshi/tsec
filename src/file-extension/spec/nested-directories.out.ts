import { User } from "./models/user.ts";
import { AuthService } from "./services/auth/auth-service.ts";
import { Logger } from "./utils/logger/logger.ts";
import { DatabaseConfig } from "./config/database/connection.ts";
import { UserStatus } from "./types/user/user-types.ts";
import { StringUtils } from "./utils/helpers/string-utils.ts";

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
