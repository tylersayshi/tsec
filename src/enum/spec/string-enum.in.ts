enum Color {
  Red = "red",
  Blue = "blue",
  Green = "green",
}

function getColorName(color: Color): string {
  return color === Color.Red ? "Red color" : "Other color";
}

const userColor: Color = Color.Blue;
