const Color = {
  Red: "red",
  Blue: "blue",
} as const;
type ColorType = typeof Color[keyof typeof Color];

const Status = {
  Active: 1,
  Inactive: 0,
} as const;
type StatusType = typeof Status[keyof typeof Status];

const Priority = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
} as const;
type PriorityType = typeof Priority[keyof typeof Priority];

interface Task {
  color: ColorType;
  status: StatusType;
  priority: PriorityType;
}

function createTask(): Task {
  return {
    color: Color.Red,
    status: Status.Active,
    priority: Priority.High,
  };
}

class TaskManager {
  private tasks: Task[] = [];

  addTask(color: ColorType = Color.Blue): void {
    this.tasks.push({
      color,
      status: Status.Inactive,
      priority: Priority.Medium,
    });
  }
}
