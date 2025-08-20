import { UserService } from "@services/user";

export class UserController {
  constructor(private userService: UserService) {}

  async loadUserModule() {
    const UserModule = await import("@modules/user");
    return new UserModule.default();
  }

  async loadAuthModule() {
    const { AuthService } = await import("@services/auth");
    return new AuthService();
  }

  async loadConfig() {
    const config = await import("@config/app");
    return config.default;
  }
}
