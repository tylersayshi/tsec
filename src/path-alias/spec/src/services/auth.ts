export class AuthService {
  async authenticate(credentials: any) {
    return { token: "test-token" };
  }

  async initialize() {
    return "initialized";
  }
}

export class AuthConfig {
  apiUrl = "http://localhost:3000";
}
