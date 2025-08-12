class Employee {
  public name: string;
  public id: number;
  private department: string = "Engineering";

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }

  getDepartment(): string {
    return this.department;
  }

  setDepartment(dept: string): void {
    this.department = dept;
  }
}
