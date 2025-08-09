/**
 * Represents different user roles in the system
 */
enum UserRole {
 /** Regular user with basic permissions */
 User = "user",
 /** Moderator with elevated permissions */
 Moderator = "moderator", 
 /** Administrator with full access */
 Admin = "admin"
}

// Default role for new users
const DEFAULT_ROLE: UserRole = UserRole.User;

/*
* Permission check function
*/
function hasPermission(role: UserRole, action: string): boolean {
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