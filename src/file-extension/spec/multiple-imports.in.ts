import { User } from "./models/user.js";
import { Database } from "../database/connection.js";
import { Logger } from "./utils/logger";
import { Config } from "./config/app";
import { Types } from "./types/user";
import { Helpers } from "./utils/helpers.ts";
import { Constants } from "./constants.ts";
import { Models } from "./models/index.js";
import { Utils } from "./utils/index";
import { Configs } from "./config/index.ts";

export class MultipleImportsTest {
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
  ) {}

  async testMultipleImports() {
    this.logger.info("Testing multiple imports");
    return await this.user.findById("123");
  }
}
