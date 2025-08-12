/**
 * User class with parameter properties
 */
class User {
  /**
   * Creates a new user instance
   * @param name - The user's name
   * @param age - The user's age
   */
  constructor(public name: string, public age: number) {}

  // Get user info
  getInfo(): string {
    return `${this.name} (${this.age})`;
  }
}
