import { User } from "./models/user";
import { Database } from "../database/connection";
import { AuthService } from "../../services/auth";
import { Logger } from "./utils/logger";
import { Types } from "./types/user";

export class UserController {
  constructor(
    private userService: User,
    private db: Database,
    private auth: AuthService,
    private logger: Logger,
    private types: Types,
  ) {}

  async getUser(id: string) {
    this.logger.info("Getting user", { id });
    return null;
  }
}
