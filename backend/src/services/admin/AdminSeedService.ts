import { inject, injectable } from "inversify";

import { TYPES } from "../../container/types";
import type { IAdminRepository } from "../../interfaces/repositories/admin/IAdminRepository";
import type { IAdminSeedService } from "../../interfaces/services/admin/IAdminSeedService";
import type { IPasswordService } from "../../interfaces/services/auth/IPasswordService";
import { env } from "../../config/env";

@injectable()
export class AdminSeedService implements IAdminSeedService {
  constructor(
    @inject(TYPES.AdminRepository)
    private readonly _adminRepository: IAdminRepository,

    @inject(TYPES.PasswordService)
    private readonly _passwordService: IPasswordService,
  ) {}

  async execute(): Promise<void> {
    const email = env.ADMIN_EMAIL.trim().toLowerCase();

    const existingAdmin =
      await this._adminRepository.findByEmail(email);

    if (existingAdmin) {
      console.log(`Admin already exists: ${email}`);
      return;
    }

    const hashedPassword =
      await this._passwordService.hash(env.ADMIN_PASSWORD);

    await this._adminRepository.create({
      firstName: env.ADMIN_FIRST_NAME.trim(),
      lastName: env.ADMIN_LAST_NAME.trim(),
      email,
      password: hashedPassword,
      isActive: true,
      deletedAt: null,
    });

    console.log(`Admin created successfully: ${email}`);
  }
}
