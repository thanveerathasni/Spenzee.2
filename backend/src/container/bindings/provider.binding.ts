import { ProviderController } from "../../controllers/provider/ProviderController";
import { ProviderForgotPasswordController } from "../../controllers/provider/ProviderForgotPasswordController";
import { ProviderLoginController } from "../../controllers/provider/ProviderLoginController";
import { ProviderPasswordSetupController } from "../../controllers/provider/ProviderPasswordSetupController";
import { ProviderResetPasswordController } from "../../controllers/provider/ProviderResetPasswordController";
import { ProviderPasswordSetupTokenRepository } from "../../repositories/provider/ProviderPasswordSetupTokenRepository";
import { ProviderRepository } from "../../repositories/provider/ProviderRepository";
import { ProviderResetPasswordTokenRepository } from "../../repositories/provider/ProviderResetPasswordTokenRepository";
import { ApplyProviderService } from "../../services/provider/ApplyProviderService";
import { ProviderForgotPasswordService } from "../../services/provider/ProviderForgotPasswordService";
import { ProviderLoginService } from "../../services/provider/ProviderLoginService";
import { ProviderPasswordSetupService } from "../../services/provider/ProviderPasswordSetupService";
import { ProviderResetPasswordService } from "../../services/provider/ProviderResetPasswordService";
import { TYPES } from "../types";

import type { IProviderController } from "../../interfaces/controllers/provider/IProviderController";
import type { IProviderForgotPasswordController } from "../../interfaces/controllers/provider/IProviderForgotPasswordController";
import type { IProviderLoginController } from "../../interfaces/controllers/provider/IProviderLoginController";
import type { IProviderPasswordSetupController } from "../../interfaces/controllers/provider/IProviderPasswordSetupController";
import type { IProviderResetPasswordController } from "../../interfaces/controllers/provider/IProviderResetPasswordController";
import type { IProviderPasswordSetupTokenRepository } from "../../interfaces/repositories/provider/IProviderPasswordSetupTokenRepository";
import type { IProviderRepository } from "../../interfaces/repositories/provider/IProviderRepository";
import type { IProviderResetPasswordTokenRepository } from "../../interfaces/repositories/provider/IProviderResetPasswordTokenRepository";
import type { IApplyProviderService } from "../../interfaces/services/provider/IApplyProviderService";
import type { IProviderForgotPasswordService } from "../../interfaces/services/provider/IProviderForgotPasswordService";
import type { IProviderLoginService } from "../../interfaces/services/provider/IProviderLoginService";
import type { IProviderPasswordSetupService } from "../../interfaces/services/provider/IProviderPasswordSetupService";
import type { IProviderResetPasswordService } from "../../interfaces/services/provider/IProviderResetPasswordService";
import type { Container } from "inversify";

export function registerProviderBindings(container: Container): void {
  container
    .bind<IProviderRepository>(TYPES.ProviderRepository)
    .to(ProviderRepository);

  container
    .bind<IProviderResetPasswordTokenRepository>(
      TYPES.ProviderResetPasswordTokenRepository,
    )
    .to(ProviderResetPasswordTokenRepository);

  container
    .bind<IProviderPasswordSetupTokenRepository>(
      TYPES.ProviderPasswordSetupTokenRepository,
    )
    .to(ProviderPasswordSetupTokenRepository);

  container
    .bind<IApplyProviderService>(TYPES.ApplyProviderService)
    .to(ApplyProviderService);

  container
    .bind<IProviderLoginService>(TYPES.ProviderLoginService)
    .to(ProviderLoginService);

  container
    .bind<IProviderForgotPasswordService>(TYPES.ProviderForgotPasswordService)
    .to(ProviderForgotPasswordService);

  container
    .bind<IProviderResetPasswordService>(TYPES.ProviderResetPasswordService)
    .to(ProviderResetPasswordService);

  container
    .bind<IProviderPasswordSetupService>(TYPES.ProviderPasswordSetupService)
    .to(ProviderPasswordSetupService);

  container
    .bind<IProviderController>(TYPES.ProviderController)
    .to(ProviderController);

  container
    .bind<IProviderLoginController>(TYPES.ProviderLoginController)
    .to(ProviderLoginController);

  container
    .bind<IProviderForgotPasswordController>(
      TYPES.ProviderForgotPasswordController,
    )
    .to(ProviderForgotPasswordController);

  container
    .bind<IProviderResetPasswordController>(
      TYPES.ProviderResetPasswordController,
    )
    .to(ProviderResetPasswordController);

  container
    .bind<IProviderPasswordSetupController>(
      TYPES.ProviderPasswordSetupController,
    )
    .to(ProviderPasswordSetupController);
}
