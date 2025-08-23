import { User } from "./models/index.js";
import { Database } from "../database/index";
import { AuthService } from "../../services/index.js";
import { Logger } from "./utils/index";
import { Config } from "./config/index.ts";
import { Types } from "./types/index.ts";

export class IndexFileTest {
  constructor(
    private userService: InstanceType<typeof User>,
    private db: Database,
    private auth: AuthService,
    private logger: Logger,
    private config: typeof Config,
    private types: Types,
  ) {}

  async testIndexFiles() {
    this.logger.info("Testing index file imports");
    return await this.userService.findById("123");
  }
}
