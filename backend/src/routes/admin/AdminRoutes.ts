import { Router } from "express";

import { container } from "../../container";
import { TYPES } from "../../container/types";
import { validate } from "../../middlewares/validate";
import { ADMIN_ROUTES } from "../../shared/constants";
import { loginSchema } from "../../validators/auth/LoginValidator";

import type { IAdminController } from "../../interfaces/controllers/admin/IAdminController";
import type { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";

const router = Router();

const adminController = container.get<IAdminController>(
  TYPES.AdminController,
);

const adminAuthMiddleware = container.get<IAuthMiddleware>(
  TYPES.AdminAuthMiddleware,
);

// Admin login
router.post(
  ADMIN_ROUTES.LOGIN,
  validate(loginSchema),
  adminController.login,
);

// Admin provider management
router.get(
  ADMIN_ROUTES.PENDING_PROVIDERS,
  adminAuthMiddleware.authenticate,
  adminController.getPendingProviders,
);

router.patch(
  ADMIN_ROUTES.APPROVE_PROVIDER,
  adminAuthMiddleware.authenticate,
  adminController.approveProvider,
);

router.patch(
  ADMIN_ROUTES.REJECT_PROVIDER,
  adminAuthMiddleware.authenticate,
  adminController.rejectProvider,
);

export default router;
