export interface AuthSettings {
  jwtSecret: string;
  expiresIn: string;
  refreshTokenExpiry: string;
}

export class AuthConfig {
  static readonly defaultSettings: AuthSettings = {
    jwtSecret: "default-secret",
    expiresIn: "1h",
    refreshTokenExpiry: "7d",
  };
}
