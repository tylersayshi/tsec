export class UserService {
  async findById(id: string) {
    return { id, name: "Test User" };
  }

  async create(userData: any) {
    return { ...userData, id: "123" };
  }

  test() {
    return "test";
  }

  getConfig() {
    return { apiUrl: "http://localhost:3000", port: 3000 };
  }
}
