import type { UserType } from "../types/user.ts";
import type { ConfigType } from "../config/types.ts";
import type { DatabaseType } from "../database/types.ts";

import { UserService } from "../services/user.ts";

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(userData: UserType): Promise<UserType> {
    return this.userService.create(userData);
  }

  getConfig(): ConfigType {
    return this.userService.getConfig();
  }
}
