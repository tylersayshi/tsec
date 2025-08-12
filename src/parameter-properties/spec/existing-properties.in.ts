class Employee {
  private department: string = "Engineering";

  constructor(public name: string, public id: number) {}

  getDepartment(): string {
    return this.department;
  }

  setDepartment(dept: string): void {
    this.department = dept;
  }
}
