import { Router } from "express";

import { container } from "../../container";
import { TYPES } from "../../container/types";
import { validate } from "../../middlewares/validate";
import { AUTH_ROUTES } from "../../shared/constants";
import { changePasswordSchema } from "../../validators/auth/ChangePasswordValidator";
import { forgotPasswordSchema } from "../../validators/auth/ForgotPasswordValidator";
import { loginSchema } from "../../validators/auth/LoginValidator";
import { logoutSchema } from "../../validators/auth/LogoutValidator";
import { refreshTokenSchema } from "../../validators/auth/RefreshTokenValidator";
import { registerUserSchema } from "../../validators/auth/registerUser.validator";
import { resetPasswordSchema } from "../../validators/auth/ResetPasswordValidator";
import { verifyOtpSchema } from "../../validators/auth/verifyOtp.validator";

import type { IAuthController } from "../../interfaces/controllers/auth/IAuthController";
import type { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";

const router = Router();

const authController = container.get<IAuthController>(
  TYPES.AuthController,
);

const authMiddleware = container.get<IAuthMiddleware>(
  TYPES.AuthMiddleware,
);

router.post(
  AUTH_ROUTES.REGISTER,
  validate(registerUserSchema),
  authController.register,
);

router.post(
  AUTH_ROUTES.VERIFY_OTP,
  validate(verifyOtpSchema),
  authController.verifyOtp,
);

router.post(
  AUTH_ROUTES.LOGIN,
  validate(loginSchema),
  authController.login,
);

router.post(
  AUTH_ROUTES.REFRESH_TOKEN,
  validate(refreshTokenSchema),
  authController.refreshToken,
);

router.post(
  AUTH_ROUTES.LOGOUT,
  validate(logoutSchema),
  authController.logout,
);

router.post(
  AUTH_ROUTES.FORGOT_PASSWORD,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);

router.post(
  AUTH_ROUTES.RESET_PASSWORD,
  validate(resetPasswordSchema),
  authController.resetPassword,
);

router.post(
  AUTH_ROUTES.CHANGE_PASSWORD,
  authMiddleware.authenticate,
  validate(changePasswordSchema),
  authController.changePassword,
);

export default router;
