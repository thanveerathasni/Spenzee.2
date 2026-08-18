import { injectable } from "inversify";

import { BaseRepository } from "../base/BaseRepository";

import type { IAdminRepository } from "../../interfaces/repositories/admin/IAdminRepository";
import type { IAdmin } from "../../models/Admin.model";
import { AdminModel } from "../../models/Admin.model";

@injectable()
export class AdminRepository
  extends BaseRepository<IAdmin>
  implements IAdminRepository
{
  constructor() {
    super(AdminModel);
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return this.findOne({
      email: email.trim().toLowerCase(),
    });
  }

  async findLoginAdminByEmail(email: string): Promise<IAdmin | null> {
    return this.model
      .findOne({
        email: email.trim().toLowerCase(),
        deletedAt: null,
      })
      .select("+password");
  }
}
