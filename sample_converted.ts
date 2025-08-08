const Color = {
  Red: "red",
  Green: "green",
  Blue: "blue"
} as const;
type ColorType = typeof Color[keyof typeof Color];

const Status = {
  Pending: 0,
  Active: 1,
  Inactive: 2
} as const;
type StatusType = typeof Status[keyof typeof Status];

const Direction = {
  North: "NORTH",
  South: "SOUTH",
  East: "EAST",
  West: "WEST"
} as const;
type DirectionType = typeof Direction[keyof typeof Direction];

const Priority = {
  Low: 0,
  Medium: 1,
  High: 2,
  Critical: "CRITICAL"
} as const;
type PriorityType = typeof Priority[keyof typeof Priority];

function _getColorName(color: ColorType): string {
  return color;
}

function _getStatusText(status: StatusType): string {
  switch (status) {
    case Status.Pending:
      return "Pending";
    case Status.Active:
      return "Active";
    case Status.Inactive:
      return "Inactive";
    default:
      return "Unknown";
  }
}

interface User {
  id: number;
  name: string;
  status: StatusType;
  favoriteColor: ColorType;
}

class Navigation {
  private currentDirection: DirectionType = Direction.North;

  turnLeft(): void {
    switch (this.currentDirection) {
      case Direction.North:
        this.currentDirection = Direction.West;
        break;
      case Direction.West:
        this.currentDirection = Direction.South;
        break;
      case Direction.South:
        this.currentDirection = Direction.East;
        break;
      case Direction.East:
        this.currentDirection = Direction.North;
        break;
    }
  }

  getDirection(): DirectionType {
    return this.currentDirection;
  }
}

type TaskPriority = Priority.Low | Priority.Medium | Priority.High;

function processTask(priority: TaskPriority): void {
  console.log(`Processing task with priority: ${priority}`);
}

const _allColors: ColorType[] = [Color.Red, Color.Green, Color.Blue];

const _colorMap: Record<ColorType, string> = {
  [Color.Red]: "#FF0000",
  [Color.Green]: "#00FF00",
  [Color.Blue]: "#0000FF",
};

function _createEnumArray<T extends string>(enumObj: Record<string, T>): T[] {
  return Object.values(enumObj);
}

const _user: User = {
  id: 1,
  name: "John",
  status: Status.Active,
  favoriteColor: Color.Blue,
};

const navigation = new Navigation();
navigation.turnLeft();
console.log(navigation.getDirection());

processTask(Priority.High);

export { Color, Status, Direction, Priority };
export type { User, TaskPriority };
