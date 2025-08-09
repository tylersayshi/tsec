/**
 * Represents different user roles in the system
 */
const UserRole = {
  /** Regular user with basic permissions */
  User: "user",
  /** Moderator with elevated permissions */
  Moderator: "moderator",
  /** Administrator with full access */
  Admin: "admin",
} as const;
type UserRoleType = typeof UserRole[keyof typeof UserRole];

// Default role for new users
const DEFAULT_ROLE: UserRoleType = UserRole.User;

/*
* Permission check function
*/
function hasPermission(role: UserRoleType, action: string): boolean {
 switch (role) {
   case UserRole.Admin:
     return true; // Admin can do everything
   case UserRole.Moderator:
     return action !== "delete_user";
   case UserRole.User:
     return action === "read";
   default:
     return false;
 }
}