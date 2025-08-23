import { User } from "./models/user.ts";
import { Logger } from "./utils/logger.ts";
import { Config } from "./config/app.ts";
import { Types } from "./types/user.ts";
import { Helpers } from "./utils/helpers.ts";
import { Constants } from "./constants.ts";
import { Models } from "./models/index.ts";
import { Utils } from "./utils/index.ts";
import { Configs } from "./config/index.ts";

export class MultipleImportsTest {
  constructor(
    private user: InstanceType<typeof User>,
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
