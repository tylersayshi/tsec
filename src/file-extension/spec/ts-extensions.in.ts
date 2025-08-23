import { User } from "./models/user.ts";
import { Database } from "../database/connection.ts";
import { Logger } from "./utils/logger.ts";
import { Config } from "./config/app.ts";
import { Types } from "./types/user.ts";

export class TsExtensionTest {
  constructor(
    private userService: InstanceType<typeof User>,
    private db: Database,
    private logger: Logger,
    private config: typeof Config,
    private types: Types,
  ) {}

  async testTsExtensions() {
    this.logger.info("Testing .ts extensions remain unchanged");
    return await this.userService.findById("123");
  }
}
