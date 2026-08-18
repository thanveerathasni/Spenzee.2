import type { IProvider } from "../../../models/Provider.model";

export interface IAdminProviderService {
  getPendingProviders(): Promise<IProvider[]>;
  approveProvider(providerId: string): Promise<void>;
  rejectProvider(providerId: string): Promise<void>;
}
