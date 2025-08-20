import { UserModel } from "../models/index.ts";
import { AuthService } from "../services/auth.ts";
import { DatabaseConfig } from "../config/database.ts";
import { ValidationError } from "../types/errors.ts";

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
