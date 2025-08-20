import { UserModel } from "../src/models/index.ts";
import { AuthService } from "../src/services/auth.ts";
import { DatabaseConfig } from "../src/config/database.ts";
import { ValidationError } from "../src/types/errors.ts";

export class AuthController {
  constructor(
    private authService: AuthService,
    private dbConfig: DatabaseConfig,
  ) {}

  async login(credentials: UserModel.LoginCredentials) {
    try {
      return await this.authService.authenticate(credentials);
    } catch (error) {
      throw new ValidationError("Invalid credentials");
    }
  }
}
