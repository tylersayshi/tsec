export class AuthModel {
  token: string;
  userId: string;

  constructor(data: any) {
    this.token = data.token;
    this.userId = data.userId;
  }
}
