interface UserData {
  id: string;
  name: string;
  email: string;
}

type Status = "active" | "inactive" | "pending";

class UserManager {
  public users: UserData[];
  private statusFilter: Status;
  protected config: { maxUsers: number; timeout: number };

  constructor(
    users: UserData[],
    statusFilter: Status,
    config: { maxUsers: number; timeout: number },
  ) {
    this.users = users;
    this.statusFilter = statusFilter;
    this.config = config;
  }

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
