export class AuthService {
  authenticate(_credentials: unknown) {
    return Promise.resolve({ token: "test-token" });
  }

  initialize() {
    return Promise.resolve("initialized");
  }
}

export class AuthConfig {
  apiUrl = "http://localhost:3000";
}
