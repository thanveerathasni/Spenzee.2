import { Router } from "express";

import { container } from "../../container";
import { TYPES } from "../../container/types";

import type { IAuthController } from "../../interfaces/controllers/auth/IAuthController";

import { validate } from "../../middlewares/validate";

import { registerUserSchema } from "../../validators/auth/registerUser.validator";
import { verifyOtpSchema } from "../../validators/auth/verifyOtp.validator";
import { loginSchema } from "../../validators/auth/LoginValidator";
import { refreshTokenSchema } from "../../validators/auth/RefreshTokenValidator";
import { logoutSchema } from "../../validators/auth/LogoutValidator";
import { forgotPasswordSchema } from "../../validators/auth/ForgotPasswordValidator";
import { resetPasswordSchema } from "../../validators/auth/ResetPasswordValidator";
const router = Router();

const authController = container.get<IAuthController>(TYPES.AuthController);

router.post("/register", validate(registerUserSchema), authController.register);

router.post("/verify-otp", validate(verifyOtpSchema), authController.verifyOtp);

router.post("/login", validate(loginSchema), authController.login);

router.post("/refresh-token", validate(refreshTokenSchema), authController.refreshToken);

router.post("/logout", validate(logoutSchema), authController.logout);

router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);

router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

export default router;
