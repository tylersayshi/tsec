interface UserData {
  id: string;
  name: string;
  email: string;
}

type Status = "active" | "inactive" | "pending";

class UserManager {
  constructor(
    public users: UserData[],
    private statusFilter: Status,
    protected config: { maxUsers: number; timeout: number },
  ) {}

  getUsers(): UserData[] {
    return this.users;
  }

  getStatusFilter(): Status {
    return this.statusFilter;
  }

  getConfig(): { maxUsers: number; timeout: number } {
    return this.config;
  }
}
