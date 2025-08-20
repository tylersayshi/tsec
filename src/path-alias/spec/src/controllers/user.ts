export default class UserController {
  constructor() {}

  async getUser(id: string) {
    return { id, name: "Test User" };
  }
}
