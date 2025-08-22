export interface AuthServiceConfig {
  tokenExpiry: string;
  refreshExpiry: string;
}

export class AuthService {
  constructor(private config: AuthServiceConfig) {}

  async validateUser(credentials: any): Promise<boolean> {
    return true;
  }

  async createToken(userId: string): Promise<string> {
    return `auth-token-${userId}`;
  }
}