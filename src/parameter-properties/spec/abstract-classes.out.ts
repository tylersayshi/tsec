abstract class Animal {
  public name: string;
  protected species: string;

  constructor(name: string, species: string) {
    this.name = name;
    this.species = species;
  }

  abstract makeSound(): string;

  getName(): string {
    return this.name;
  }

  getSpecies(): string {
    return this.species;
  }
}

class Dog extends Animal {
  public breed: string;

  constructor(name: string, breed: string) {
    super(name, "Canis");
    this.breed = breed;
  }

  makeSound(): string {
    return "Woof!";
  }

  getBreed(): string {
    return this.breed;
  }
}
