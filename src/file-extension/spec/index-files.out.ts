import { User } from "./models/index.ts";
import { Database } from "../database/index.ts";
import { AuthService } from "../../services/index.ts";
import { Logger } from "./utils/index.ts";
import { Config } from "./config/index.ts";
import { Types } from "./types/index.ts";

export class IndexFileTest {
  constructor(
    private userService: User,
    private db: Database,
    private auth: AuthService,
    private logger: Logger,
    private config: Config,
    private types: Types,
  ) {}

  async testIndexFiles() {
    this.logger.info("Testing index file imports");
    return await this.userService.findById("123");
  }
}
