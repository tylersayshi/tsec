import { User } from "./models/user.ts";
import { Database } from "../database/connection.ts";
import { AuthService } from "../../services/auth.ts";
import { Logger } from "./utils/logger.ts";
import { Config } from "./config/app.ts";
import { Types } from "./types/user.ts";

export class UserController {
  constructor(
    private userService: User,
    private db: Database,
    private auth: AuthService,
    private logger: Logger,
    private config: Config,
    private types: Types,
  ) {}

  async getUser(id: string) {
    this.logger.info("Getting user", { id });
    return await this.userService.findById(id);
  }
}
