import { User } from "./models/user.ts";
import { Database } from "../database/connection.ts";
import { Logger } from "./utils/logger.ts";
import { Config } from "./config/app.ts";
import { Types } from "./types/user.ts";
import { Helpers } from "./utils/helpers.ts";
import { Constants } from "./constants.ts";
import { Models } from "./models/index.ts";
import { Utils } from "./utils/index.ts";
import { Configs } from "./config/index.ts";
import { UserService } from "./services/user/user-service.ts";
import { AuthConfig } from "./config/auth/auth-config.ts";
import { LoggerConfig } from "./config/logger/logger-config.ts";
import { DeepNested } from "./very/deep/nested/path/file.ts";
import { AnotherDeep } from "./another/very/deep/nested/path/file.ts";
import { YetAnother } from "./yet/another/very/deep/nested/path/file.ts";

export class ComplexPathsTest {
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
    private userService: UserService,
    private authConfig: AuthConfig,
    private loggerConfig: LoggerConfig,
    private deepNested: typeof DeepNested,
    private anotherDeep: typeof AnotherDeep,
    private yetAnother: typeof YetAnother,
  ) {}

  async testComplexPaths() {
    this.logger.info("Testing complex relative paths");
    return await this.userService.findById("123");
  }
}
