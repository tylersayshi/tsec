export interface AuthSettings {
  secret: string;
  expiresIn: string;
}

export class AuthService {
  constructor(private settings: AuthSettings) {}

  authenticate(token: string): Promise<boolean> {
    return Promise.resolve(token === "valid-token");
  }

  generateToken(userId: string): Promise<string> {
    return Promise.resolve(`token-${userId}`);
  }
}
