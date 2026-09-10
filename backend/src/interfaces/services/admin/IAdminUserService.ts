export interface IAdminUserService {
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
}