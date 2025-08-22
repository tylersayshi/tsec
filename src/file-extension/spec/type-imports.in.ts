import type { User } from "./models/user.js";
import type { Database } from "../database/connection";
import type { AuthService } from "../../services/auth.ts";
import type { Logger } from "./utils/logger";
import type { Config } from "./config/app.ts";

export class TypeImportTest {
  constructor(
    private userService: User,
    private db: Database,
    private auth: AuthService,
    private logger: Logger,
    private config: Config,
  ) {}

  async testTypeImports(): Promise<User> {
    this.logger.info("Testing type-only imports");
    return await this.userService.findById("123");
  }
}
