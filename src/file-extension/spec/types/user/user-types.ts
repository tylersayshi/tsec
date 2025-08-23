export type UserStatus = "active" | "inactive" | "pending";

export interface UserMetadata {
  lastLogin: Date;
  loginCount: number;
  preferences: Record<string, any>;
}

export interface UserTypes {
  status: UserStatus;
  metadata: UserMetadata;
}

export class UserTypeHelper {
  static isActiveUser(status: UserStatus): boolean {
    return status === "active";
  }
}
