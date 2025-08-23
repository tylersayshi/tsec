export class DynamicImportTest {
  async testDynamicImports() {
    // Dynamic imports should be processed
    const userModule = await import("./models/user.js");
    const loggerModule = await import("./utils/logger");
    const configModule = await import("./config/app.ts");

    return {
      user: userModule.User,
      logger: loggerModule.Logger,
      config: configModule.Config,
    };
  }
}
