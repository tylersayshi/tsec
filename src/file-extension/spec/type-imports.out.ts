import { UserService } from "./models/user.ts";
import type { User } from "./models/user.ts";
import type { Database } from "../database/connection.ts";
import type { Logger } from "./utils/logger.ts";
import type { AppConfig as Config } from "./config/app.ts";

export class TypeImportTest {
  constructor(
    private userService: UserService,
    private db: Database,
    private logger: Logger,
    private config: Config,
  ) {}

  async testTypeImports(): Promise<User | null> {
    this.logger.info("Testing type-only imports");
    return await this.userService.findById("123");
  }
}
