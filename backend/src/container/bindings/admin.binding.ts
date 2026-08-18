import type { Container } from "inversify";

import { TYPES } from "../types";

import type { IAdminRepository } from "../../interfaces/repositories/admin/IAdminRepository";
import type { IAdminSeedService } from "../../interfaces/services/admin/IAdminSeedService";
import type { IAdminLoginService } from "../../interfaces/services/admin/IAdminLoginService";
import type { IAdminController } from "../../interfaces/controllers/admin/IAdminController";

import { AdminRepository } from "../../repositories/admin/AdminRepository";
import { AdminSeedService } from "../../services/admin/AdminSeedService";
import { AdminLoginService } from "../../services/admin/AdminLoginService";
import { AdminController } from "../../controllers/admin/AdminController";

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
    .bind<IAdminController>(TYPES.AdminController)
    .to(AdminController);
}