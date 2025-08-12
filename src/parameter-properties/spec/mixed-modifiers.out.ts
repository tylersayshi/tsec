class Product {
  public name: string;
  private price: number;
  protected category: string;
  readonly id: string;

  constructor(name: string, price: number, category: string, id: string) {
    this.name = name;
    this.price = price;
    this.category = category;
    this.id = id;
  }

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }

  getCategory(): string {
    return this.category;
  }

  getId(): string {
    return this.id;
  }
}
