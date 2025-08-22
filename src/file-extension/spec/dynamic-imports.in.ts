export class DynamicImportTest {
  async testDynamicImports() {
    // Dynamic imports should be processed
    const userModule = await import("./models/user.js");
    const databaseModule = await import("../database/connection");
    const authModule = await import("../../services/auth.ts");
    const loggerModule = await import("./utils/logger");
    const configModule = await import("./config/app.ts");

    return {
      user: userModule.User,
      database: databaseModule.Database,
      auth: authModule.AuthService,
      logger: loggerModule.Logger,
      config: configModule.Config,
    };
  }
}
