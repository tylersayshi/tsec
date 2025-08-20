export default class UserModule {
  constructor() {}

  async getUser(id: string) {
    return { id, name: "Test User" };
  }
}
