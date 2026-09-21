export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  PROVIDER = "PROVIDER",
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isVerified: boolean;
  role: UserRole;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: AuthenticatedUser;
}
