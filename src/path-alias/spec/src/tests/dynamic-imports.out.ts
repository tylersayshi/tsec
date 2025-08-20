import { UserService } from "../services/user.ts";

export class UserController {
  constructor(private userService: UserService) {}

  async loadUserModule() {
    const UserModule = await import("../modules/user.ts");
    return new UserModule.default();
  }

  async loadAuthModule() {
    const { AuthService } = await import("../services/auth.ts");
    return new AuthService();
  }

  async loadConfig() {
    const config = await import("../config/app.ts");
    return config.default;
  }
}
