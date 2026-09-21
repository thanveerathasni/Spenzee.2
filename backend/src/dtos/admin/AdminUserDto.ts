import type { AuthProvider } from "../../shared/enums/AuthProvider";

export interface IAdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  authProvider: AuthProvider;
  isVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
