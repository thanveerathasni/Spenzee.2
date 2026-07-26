import { Router } from "express";

import { container } from "../../container";
import { TYPES } from "../../container/types";

import type { IAuthController } from "../../interfaces/controllers/auth/IAuthController";

import { validate } from "../../middlewares/validate";

import { registerUserSchema } from "../../validators/auth/registerUser.validator";
import { verifyOtpSchema } from "../../validators/auth/verifyOtp.validator";
const router = Router();

const authController = container.get<IAuthController>(
    TYPES.AuthController,
);

router.post(
    "/register",
    validate(registerUserSchema),
    authController.register,
);

router.post(
    "/verify-otp",
    validate(verifyOtpSchema),
    authController.verifyOtp,
);

export default router;