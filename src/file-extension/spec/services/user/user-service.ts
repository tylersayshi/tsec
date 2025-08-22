import type { User } from "../../models/user.ts";

export class UserService {
  async findById(id: string): Promise<User | null> {
    return { id, name: "Test User", email: "test@example.com" };
  }

  async createUser(userData: Omit<User, "id">): Promise<User> {
    return { id: "generated-id", ...userData };
  }
}