export class UserModel {
  id: string;
  name: string;
  email: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
  }
}
