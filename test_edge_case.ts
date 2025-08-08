const StringEnum = {
  X: "x",
  Y: "y"
} as const;

type StringEnum = typeof StringEnum[keyof typeof StringEnum];
