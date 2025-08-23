import { User } from "./models/user.ts";
import { Database } from "../database/connection.ts";
import { Logger } from "./utils/logger.ts";
import { Types } from "./types/user.ts";

export class UserController {
  constructor(
    private userService: User,
    private db: Database,
    private logger: Logger,
    private types: Types,
  ) {}

  async getUser(id: string) {
    this.logger.info("Getting user", { id });
    return null;
  }
}
