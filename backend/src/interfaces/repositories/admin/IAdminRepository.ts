import type { IAdmin } from "../../../models/Admin.model";
import type { IBaseRepository } from "../base/IBaseRepository";

export interface IAdminRepository extends IBaseRepository<IAdmin> {
  findByEmail(email: string): Promise<IAdmin | null>;

  findLoginAdminByEmail(email: string): Promise<IAdmin | null>;
}
