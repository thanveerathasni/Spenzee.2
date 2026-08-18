import { Router } from "express";

import { container } from "../../container";
import { TYPES } from "../../container/types";
import { validate } from "../../middlewares/validate";
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

const authController = container.get<IAuthController>(TYPES.AuthController);
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

router.post("/register", validate(registerUserSchema), authController.register);

router.post("/verify-otp", validate(verifyOtpSchema), authController.verifyOtp);

router.post("/login", validate(loginSchema), authController.login);

router.post("/refresh-token", validate(refreshTokenSchema), authController.refreshToken);

router.post("/logout", validate(logoutSchema), authController.logout);

router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);

router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

router.post(
  "/change-password",
  authMiddleware.authenticate,
  validate(changePasswordSchema),
  authController.changePassword,
);

export default router;
