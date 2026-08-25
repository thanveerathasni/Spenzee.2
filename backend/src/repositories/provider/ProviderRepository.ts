import { injectable } from "inversify";

import { ProviderModel } from "../../models/Provider.model";
import { ProviderStatus } from "../../shared/enums/ProviderStatus";
import { BaseRepository } from "../base/BaseRepository";

import type { IProviderRepository } from "../../interfaces/repositories/provider/IProviderRepository";
import type { IProvider } from "../../models/Provider.model";

@injectable()
export class ProviderRepository extends BaseRepository<IProvider> implements IProviderRepository {
  constructor() {
    super(ProviderModel);
  }

async findByEmail(email: string): Promise<IProvider | null> {
  return this.model
    .findOne({
      email: email.trim().toLowerCase(),
      deletedAt: null,
    })
    .select("+password");
}

  async findByStatus(status: ProviderStatus): Promise<IProvider[]> {
    return this.model.find({
      status,
    });
  }

  async updateStatus(id: string, status: ProviderStatus): Promise<IProvider | null> {
    return this.model.findOneAndUpdate(
      {
        _id: id,
      },
      {
        status,
      },
      {
        new: true,
      },
    );
  }
}
