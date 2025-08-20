import type { UserType } from "../src/types/user.ts";
import type { ConfigType } from "../src/config/types.ts";
import type { DatabaseType } from "../src/database/types.ts";

import { UserService } from "../src/services/user.ts";

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(userData: UserType): Promise<UserType> {
    return this.userService.create(userData);
  }

  getConfig(): ConfigType {
    return this.userService.getConfig();
  }
}
