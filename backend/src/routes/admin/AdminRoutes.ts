import { Router } from "express";

import { container } from "../../container";
import { TYPES } from "../../container/types";
import { validate } from "../../middlewares/validate";
import { loginSchema } from "../../validators/auth/LoginValidator";

import type { IAdminController } from "../../interfaces/controllers/admin/IAdminController";
import type { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";


const router = Router();

const adminController = container.get<IAdminController>(TYPES.AdminController);

const adminAuthMiddleware = container.get<IAuthMiddleware>(TYPES.AdminAuthMiddleware);

// Admin login
router.post("/login", validate(loginSchema), adminController.login);

// Admin provider management
router.get(
  "/providers/pending",
  adminAuthMiddleware.authenticate,
  adminController.getPendingProviders,
);

router.patch(
  "/providers/:id/approve",
  adminAuthMiddleware.authenticate,
  adminController.approveProvider,
);

router.patch(
  "/providers/:id/reject",
  adminAuthMiddleware.authenticate,
  adminController.rejectProvider,
);

export default router;
