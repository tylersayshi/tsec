abstract class Animal {
  constructor(public name: string, protected species: string) {}

  abstract makeSound(): string;

  getName(): string {
    return this.name;
  }

  getSpecies(): string {
    return this.species;
  }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name, "Canis");
  }

  makeSound(): string {
    return "Woof!";
  }

  getBreed(): string {
    return this.breed;
  }
}
