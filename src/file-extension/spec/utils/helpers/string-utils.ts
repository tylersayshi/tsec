export interface StringHelperOptions {
  trim: boolean;
  lowercase: boolean;
  removeSpecialChars: boolean;
}

export class StringUtils {
  static format(
    input: string,
    options: Partial<StringHelperOptions> = {},
  ): string {
    let result = input;

    if (options.trim) {
      result = result.trim();
    }

    if (options.lowercase) {
      result = result.toLowerCase();
    }

    return result;
  }

  static validate(input: string): boolean {
    return input.length > 0;
  }
}
