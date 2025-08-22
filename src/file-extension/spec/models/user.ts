export interface User {
  id: string;
  name: string;
  email: string;
  findById(id: string): Promise<User | null>;
}

export class UserService {
  async findById(id: string): Promise<User | null> {
    return { id, name: "Test User", email: "test@example.com" };
  }
}

export const User = UserService;