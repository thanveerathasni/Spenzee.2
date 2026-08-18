import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import { ProviderStatus } from "../../shared/enums/ProviderStatus";

import type { IProviderRepository } from "../../interfaces/repositories/provider/IProviderRepository";
import type { IAdminProviderService } from "../../interfaces/services/admin/IAdminProviderService";
import type { IProvider } from "../../models/Provider.model";

@injectable()
export class AdminProviderService implements IAdminProviderService {
  constructor(
    @inject(TYPES.ProviderRepository)
    private readonly _providerRepository: IProviderRepository,
  ) {}

  async getPendingProviders(): Promise<IProvider[]> {
    return this._providerRepository.findByStatus(ProviderStatus.PENDING);
  }

  async approveProvider(providerId: string): Promise<void> {
    await this._providerRepository.updateStatus(
      providerId,
      ProviderStatus.ACTIVE,
    );
  }

  async rejectProvider(providerId: string): Promise<void> {
    await this._providerRepository.updateStatus(
      providerId,
      ProviderStatus.REJECTED,
    );
  }
}
