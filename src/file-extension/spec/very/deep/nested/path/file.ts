export interface DeepNestedType {
  id: string;
  value: string;
}

export class DeepNestedClass {
  static getData(): DeepNestedType {
    return { id: "deep", value: "nested" };
  }
}

export const DeepNested = DeepNestedClass;
