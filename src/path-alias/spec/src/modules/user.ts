export default class UserModule {
  constructor() {}

  getUser(id: string) {
    return Promise.resolve({ id, name: "Test User" });
  }
}
