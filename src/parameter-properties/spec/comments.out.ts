/**
 * User class with parameter properties
 */
class User {
  public name: string;
  public age: number;

  /**
   * Creates a new user instance
   * @param name - The user's name
   * @param age - The user's age
   */
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  // Get user info
  getInfo(): string {
    return `${this.name} (${this.age})`;
  }
}
