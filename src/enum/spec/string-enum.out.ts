const Color = {
  Red: "red",
  Blue: "blue",
  Green: "green",
} as const;
type ColorType = typeof Color[keyof typeof Color];

function getColorName(color: ColorType): string {
  return color === Color.Red ? "Red color" : "Other color";
}

const userColor: ColorType = Color.Blue;
