export class Helpers {
  static formatString(input: string): string {
    return input.trim().toLowerCase();
  }

  static validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  static generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  formatString(input: string): string {
    return Helpers.formatString(input);
  }
}
