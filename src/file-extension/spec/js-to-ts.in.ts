import { User } from "./models/user.js";
import { Database } from "../database/connection.js";
import { AuthService } from "../../services/auth.js";
import { Logger } from "./utils/logger.js";

export class UserController {
  constructor(
    private userService: User,
    private db: Database,
    private auth: AuthService,
    private logger: Logger,
  ) {}

  async getUser(id: string) {
    this.logger.info("Getting user", { id });
    return await this.userService.email;
  }
}
