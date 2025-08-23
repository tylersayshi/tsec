export default class UserController {
  constructor() {}

  getUser(id: string) {
    return Promise.resolve({ id, name: "Test User" });
  }
}
