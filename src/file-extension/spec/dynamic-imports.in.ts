export class DynamicImportTest {
  async testDynamicImports() {
    // Dynamic imports should be processed
    const userModule = await import("./models/user.js");
    const databaseModule = await import("../database/connection");
    const loggerModule = await import("./utils/logger");
    const configModule = await import("./config/app.ts");

    return {
      user: userModule.User,
      database: databaseModule.Database,
      logger: loggerModule.Logger,
      config: configModule.Config,
    };
  }
}
