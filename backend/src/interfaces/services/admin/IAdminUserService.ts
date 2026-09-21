import type { IAdminUser } from "../../../dtos/admin/AdminUserDto";

export interface IAdminUserService {
  getUsers(): Promise<IAdminUser[]>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
}
