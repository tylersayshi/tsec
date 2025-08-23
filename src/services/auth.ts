export interface AuthConfig {
  secret: string;
  expiresIn: string;
}

export class AuthService {
  constructor(private config: AuthConfig) {}

  async login(email: string, password: string): Promise<string> {
    return "mock-jwt-token";
  }

  async validateToken(token: string): Promise<boolean> {
    return token === "mock-jwt-token";
  }
}
