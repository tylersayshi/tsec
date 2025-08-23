import type { User } from "../../models/user.ts";

export class UserService {
  findById(id: string): Promise<User | null> {
    return Promise.resolve({
      id,
      name: "Test User",
      email: "test@example.com",
    });
  }

  createUser(userData: Omit<User, "id">): Promise<User> {
    return Promise.resolve({ id: "generated-id", ...userData });
  }
}
