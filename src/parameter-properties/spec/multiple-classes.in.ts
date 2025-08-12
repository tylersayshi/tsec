class Person {
  constructor(public name: string, public age: number) {}

  introduce(): string {
    return `Hi, I'm ${this.name} and I'm ${this.age} years old.`;
  }
}

class Car {
  constructor(
    private brand: string,
    private model: string,
    public year: number,
  ) {}

  getBrand(): string {
    return this.brand;
  }

  getModel(): string {
    return this.model;
  }

  getYear(): number {
    return this.year;
  }
}

class Database {
  constructor(
    readonly connectionString: string,
    private maxConnections: number,
  ) {}

  getConnectionString(): string {
    return this.connectionString;
  }

  getMaxConnections(): number {
    return this.maxConnections;
  }
}
