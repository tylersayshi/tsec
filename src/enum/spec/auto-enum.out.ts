const Direction = {
  North: "North",
  South: "South",
  East: "East",
  West: "West",
} as const;
type DirectionType = typeof Direction[keyof typeof Direction];

const compass: DirectionType[] = [
  Direction.North,
  Direction.South,
  Direction.East,
  Direction.West,
];
