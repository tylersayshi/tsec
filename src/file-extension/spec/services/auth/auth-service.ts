export interface AuthServiceConfig {
  tokenExpiry: string;
  refreshExpiry: string;
}

export class AuthService {
  constructor(private config: AuthServiceConfig) {}

  validateUser(_credentials: unknown): Promise<boolean> {
    return Promise.resolve(true);
  }

  createToken(userId: string): Promise<string> {
    return Promise.resolve(`auth-token-${userId}`);
  }
}
