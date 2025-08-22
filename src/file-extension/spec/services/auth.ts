export interface AuthSettings {
  secret: string;
  expiresIn: string;
}

export class AuthService {
  constructor(private settings: AuthSettings) {}

  async authenticate(token: string): Promise<boolean> {
    return token === "valid-token";
  }

  async generateToken(userId: string): Promise<string> {
    return `token-${userId}`;
  }
}