import type { IAdminProvider } from "../../../dtos/admin/AdminProviderDto";

export interface IAdminProviderService {
  getPendingProviders(): Promise<IAdminProvider[]>;
  approveProvider(providerId: string): Promise<void>;
  rejectProvider(providerId: string): Promise<void>;
  getActiveProviders(): Promise<IAdminProvider[]>;
}
