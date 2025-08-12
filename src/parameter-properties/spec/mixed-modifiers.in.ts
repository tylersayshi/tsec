class Product {
  constructor(
    public name: string,
    private price: number,
    protected category: string,
    readonly id: string,
  ) {}

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
