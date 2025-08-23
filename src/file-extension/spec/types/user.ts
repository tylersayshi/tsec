export type UserRole = "admin" | "user" | "guest";

export interface UserPermissions {
  read: boolean;
  write: boolean;
  delete: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  permissions: UserPermissions;
  createdAt: Date;
  updatedAt: Date;
}

export class Types {
  static isValidRole(role: string): role is UserRole {
    return ["admin", "user", "guest"].includes(role);
  }
}
