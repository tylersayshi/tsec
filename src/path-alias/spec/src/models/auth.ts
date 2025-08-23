export class AuthModel {
  token: string;
  userId: string;

  constructor(data: Record<string, string>) {
    this.token = data.token;
    this.userId = data.userId;
  }
}
