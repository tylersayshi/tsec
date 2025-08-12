const MixedEnum = {
  First: 1,
  Second: "second",
  Third: 3,
  Fourth: "fourth",
} as const;
type MixedEnumType = typeof MixedEnum[keyof typeof MixedEnum];

function handleMixed(value: MixedEnumType): string {
  switch (value) {
    case MixedEnum.First:
      return "Number one";
    case MixedEnum.Second:
      return "String second";
    case MixedEnum.Third:
      return "Number three";
    case MixedEnum.Fourth:
      return "String fourth";
    default:
      return "Unknown";
  }
}
