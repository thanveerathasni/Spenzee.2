import { AdminController } from "../../controllers/admin/AdminController";
import { AdminRepository } from "../../repositories/admin/AdminRepository";
import { AdminLoginService } from "../../services/admin/AdminLoginService";
import { AdminProviderService } from "../../services/admin/AdminProviderService";
import { AdminSeedService } from "../../services/admin/AdminSeedService";
import { AdminUserService } from "../../services/admin/AdminUserService";
import { TYPES } from "../types";

import type { IAdminController } from "../../interfaces/controllers/admin/IAdminController";
import type { IAdminRepository } from "../../interfaces/repositories/admin/IAdminRepository";
import type { IAdminLoginService } from "../../interfaces/services/admin/IAdminLoginService";
import type { IAdminProviderService } from "../../interfaces/services/admin/IAdminProviderService";
import type { IAdminSeedService } from "../../interfaces/services/admin/IAdminSeedService";
import type { IAdminUserService } from "../../interfaces/services/admin/IAdminUserService";
import type { Container } from "inversify";

export function registerAdminBindings(container: Container): void {
  container
    .bind<IAdminRepository>(TYPES.AdminRepository)
    .to(AdminRepository);

  container
    .bind<IAdminSeedService>(TYPES.AdminSeedService)
    .to(AdminSeedService);

  container
    .bind<IAdminLoginService>(TYPES.AdminLoginService)
    .to(AdminLoginService);

  container
    .bind<IAdminProviderService>(TYPES.AdminProviderService)
    .to(AdminProviderService);

  container
    .bind<IAdminUserService>(TYPES.AdminUserService)
    .to(AdminUserService);

  container
    .bind<IAdminController>(TYPES.AdminController)
    .to(AdminController);
}
