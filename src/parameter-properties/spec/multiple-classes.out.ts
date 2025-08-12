class Person {
  public name: string;
  public age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  introduce(): string {
    return `Hi, I'm ${this.name} and I'm ${this.age} years old.`;
  }
}

class Car {
  private brand: string;
  private model: string;
  public year: number;

  constructor(brand: string, model: string, year: number) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }

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
  readonly connectionString: string;
  private maxConnections: number;

  constructor(connectionString: string, maxConnections: number) {
    this.connectionString = connectionString;
    this.maxConnections = maxConnections;
  }

  getConnectionString(): string {
    return this.connectionString;
  }

  getMaxConnections(): number {
    return this.maxConnections;
  }
}
