import type { UserType } from "../types/user";
import type { ConfigType } from "../config/types";
import type { DatabaseType } from "../database/types";

import { UserService } from "../services/user";

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(userData: UserType): Promise<UserType> {
    return this.userService.create(userData);
  }

  getConfig(): ConfigType {
    return this.userService.getConfig();
  }
}
