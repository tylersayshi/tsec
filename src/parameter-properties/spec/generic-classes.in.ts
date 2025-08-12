class Container<T> {
  constructor(private value: T, public label: string) {}

  getValue(): T {
    return this.value;
  }

  getLabel(): string {
    return this.label;
  }
}

class Pair<K, V> {
  constructor(public key: K, public value: V) {}

  getKey(): K {
    return this.key;
  }

  getValue(): V {
    return this.value;
  }
}
