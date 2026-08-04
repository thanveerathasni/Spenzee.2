import { Router } from "express";

import { container } from "../../container";
import { TYPES } from "../../container/types";

import type { IAuthController } from "../../interfaces/controllers/auth/IAuthController";

import { validate } from "../../middlewares/validate";

import { registerUserSchema } from "../../validators/auth/registerUser.validator";
import { verifyOtpSchema } from "../../validators/auth/verifyOtp.validator";
import { loginSchema } from "../../validators/auth/LoginValidator";
import { refreshTokenSchema } from "../../validators/auth/RefreshTokenValidator";
const router = Router();

const authController = container.get<IAuthController>(TYPES.AuthController);

router.post("/register", validate(registerUserSchema), authController.register);

router.post("/verify-otp", validate(verifyOtpSchema), authController.verifyOtp);

router.post("/login", validate(loginSchema), authController.login);

router.post("/refresh-token", validate(refreshTokenSchema), authController.refreshToken);

export default router;
