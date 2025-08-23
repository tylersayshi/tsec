export interface AuthConfig {
  secret: string;
  expiresIn: string;
}

export class AuthService {
  constructor(private config: AuthConfig) {}

  login(_email: string, _password: string): Promise<string> {
    return Promise.resolve("mock-jwt-token");
  }

  validateToken(token: string): Promise<boolean> {
    return Promise.resolve(token === "mock-jwt-token");
  }
}
