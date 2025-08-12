class Container<T> {
  private value: T;
  public label: string;

  constructor(value: T, label: string) {
    this.value = value;
    this.label = label;
  }

  getValue(): T {
    return this.value;
  }

  getLabel(): string {
    return this.label;
  }
}

class Pair<K, V> {
  public key: K;
  public value: V;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }

  getKey(): K {
    return this.key;
  }

  getValue(): V {
    return this.value;
  }
}
