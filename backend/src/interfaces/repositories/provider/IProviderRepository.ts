import type { IProvider } from "../../../models/Provider.model";
import type { ProviderStatus } from "../../../shared/enums/ProviderStatus";
import type { IBaseRepository } from "../base/IBaseRepository";

export interface IProviderRepository extends IBaseRepository<IProvider> {
  findByEmail(email: string): Promise<IProvider | null>;

  findByStatus(status: ProviderStatus): Promise<IProvider[]>;

  updateStatus(id: string, status: ProviderStatus): Promise<IProvider | null>;
}
