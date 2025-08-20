import { UserService } from "../src/services/user.ts";

export class UserController {
  constructor(private userService: UserService) {}

  async loadUserModule() {
    const UserModule = await import("../src/modules/user.ts");
    return new UserModule.default();
  }

  async loadAuthModule() {
    const { AuthService } = await import("../src/services/auth.ts");
    return new AuthService();
  }

  async loadConfig() {
    const config = await import("../src/config/app.ts");
    return config.default;
  }
}
