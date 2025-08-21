import { AuthService } from "../services/auth";
import { Logger } from "../utils/logger";

export async function boot() {
  const auth = new AuthService();
  const logger = new Logger();
  await auth.initialize();
  logger.info("booted");
}
