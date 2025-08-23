export interface AnotherDeepType {
  name: string;
  description: string;
}

export class AnotherDeepClass {
  static getInfo(): AnotherDeepType {
    return { name: "another", description: "deep nested file" };
  }
}

export const AnotherDeep = AnotherDeepClass;
