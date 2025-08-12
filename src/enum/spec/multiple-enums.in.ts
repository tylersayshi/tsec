enum Color {
  Red = "red",
  Blue = "blue",
}

enum Status {
  Active = 1,
  Inactive = 0,
}

enum Priority {
  Low,
  Medium,
  High,
}

interface Task {
  color: Color;
  status: Status;
  priority: Priority;
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

  addTask(color: Color = Color.Blue): void {
    this.tasks.push({
      color,
      status: Status.Inactive,
      priority: Priority.Medium,
    });
  }
}
