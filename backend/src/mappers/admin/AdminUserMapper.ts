import type { IAdminUser } from "../../dtos/admin/AdminUserDto";
import type { IUser } from "../../models/User.model";

export const AdminUserMapper = {
  toDto(user: IUser): IAdminUser {
    return {
      id: user._id!.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      profilePicture: user.profilePicture,
      authProvider: user.authProvider,
      isVerified: user.isVerified,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },

  toDtoList(users: IUser[]): IAdminUser[] {
    return users.map((user) => this.toDto(user));
  },
};
