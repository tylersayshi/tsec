import { UserService } from "../services/user";

export class DynamicImporter {
  async loadModules() {
    // Dynamic import with path alias
    const UserModule = await import("../modules/user");

    // Dynamic import with destructuring
    const { AuthService } = await import("../services/auth");

    // Dynamic import for config
    const config = await import("../config/app");

    return { UserModule, AuthService, config };
  }
}
