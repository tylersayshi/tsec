import { UserModel } from "@models/*";
import { AuthService } from "@services/auth";
import { DatabaseConfig } from "@config/database";
import { ValidationError } from "@types/errors";

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
