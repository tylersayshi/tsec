import { UserService } from "./models/user.js";
import type { User } from "./models/user.js";
import type { Database } from "../database/connection";
import type { Logger } from "./utils/logger";
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
