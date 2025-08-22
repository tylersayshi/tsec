export interface YetAnotherDeepType {
  key: string;
  metadata: Record<string, any>;
}

export class YetAnotherDeepClass {
  static process(): YetAnotherDeepType {
    return { key: "yet-another", metadata: { depth: "very deep" } };
  }
}

export const YetAnother = YetAnotherDeepClass;