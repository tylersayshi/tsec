class SimpleClass {
  private value: string;

  constructor(value: string) {
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}

class EmptyClass {
  constructor() {}

  doSomething(): void {
    console.log("Hello World");
  }
}
