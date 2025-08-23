export interface LoginCredentials {
  username: string;
  password: string;
}

export const UserModel = {
  LoginCredentials,
} as const;
