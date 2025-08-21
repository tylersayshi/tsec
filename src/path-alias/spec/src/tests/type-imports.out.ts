import type { UserType } from "../types/user";
import type { ConfigType } from "../config/types";
import type { DatabaseType } from "../database/types";

import { UserService } from "../services/user";

export class App {
  constructor(
    private userService: UserService,
    private config: ConfigType,
    private db: DatabaseType,
  ) {}

  async createUser(userData: UserType) {
    return this.userService.create(userData);
  }
}
