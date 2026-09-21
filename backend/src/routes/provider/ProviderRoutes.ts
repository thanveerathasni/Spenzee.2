import { Router } from "express";

import { container } from "../../container";
import { TYPES } from "../../container/types";
import { validate } from "../../middlewares/validate";
import { PROVIDER_ROUTES } from "../../shared/constants";
import { forgotPasswordSchema } from "../../validators/auth/ForgotPasswordValidator";
import { loginSchema } from "../../validators/auth/LoginValidator";
import { resetPasswordSchema } from "../../validators/auth/ResetPasswordValidator";
import { providerApplicationSchema } from "../../validators/provider/ProviderApplicationValidator";
import { providerPasswordSetupSchema } from "../../validators/provider/ProviderPasswordSetupValidator";

import type { IProviderController } from "../../interfaces/controllers/provider/IProviderController";
import type { IProviderForgotPasswordController } from "../../interfaces/controllers/provider/IProviderForgotPasswordController";
import type { IProviderLoginController } from "../../interfaces/controllers/provider/IProviderLoginController";
import type { IProviderPasswordSetupController } from "../../interfaces/controllers/provider/IProviderPasswordSetupController";
import type { IProviderResetPasswordController } from "../../interfaces/controllers/provider/IProviderResetPasswordController";

const router = Router();

const providerController = container.get<IProviderController>(
  TYPES.ProviderController,
);

const loginController = container.get<IProviderLoginController>(
  TYPES.ProviderLoginController,
);

const passwordSetupController =
  container.get<IProviderPasswordSetupController>(
    TYPES.ProviderPasswordSetupController,
  );

const forgotPasswordController =
  container.get<IProviderForgotPasswordController>(
    TYPES.ProviderForgotPasswordController,
  );

const resetPasswordController =
  container.get<IProviderResetPasswordController>(
    TYPES.ProviderResetPasswordController,
  );

router.post(
  PROVIDER_ROUTES.APPLY,
  validate(providerApplicationSchema),
  providerController.apply,
);

router.post(
  PROVIDER_ROUTES.LOGIN,
  validate(loginSchema),
  loginController.login,
);

router.post(
  PROVIDER_ROUTES.FORGOT_PASSWORD,
  validate(forgotPasswordSchema),
  forgotPasswordController.forgotPassword,
);

router.post(
  PROVIDER_ROUTES.RESET_PASSWORD,
  validate(resetPasswordSchema),
  resetPasswordController.resetPassword,
);

router.post(
  PROVIDER_ROUTES.SETUP_PASSWORD,
  validate(providerPasswordSetupSchema),
  passwordSetupController.setupPassword,
);

export default router;
