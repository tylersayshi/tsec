export class UserService {
  findById(id: string) {
    return Promise.resolve({ id, name: "Test User" });
  }

  create(userData: Record<string, unknown>) {
    return Promise.resolve({
      id: "123",
      name: userData.name as string || "Default Name",
      email: userData.email as string || "default@example.com",
      ...userData,
    });
  }

  test() {
    return "test";
  }

  getConfig() {
    return { apiUrl: "http://localhost:3000", port: 3000 };
  }
}
