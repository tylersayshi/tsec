export interface User {
  id: string;
  name: string;
  email: string;
}

export class UserService {
  findById(id: string): Promise<User | null> {
    return Promise.resolve({
      id,
      name: "Test User",
      email: "test@example.com",
    });
  }
}

export const User = UserService;
