class User {
  constructor(public name: string, public age: number) {}
}

const user = new User("John", 30);
console.log(user.name, user.age);
