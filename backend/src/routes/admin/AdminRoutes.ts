import { Router } from "express";

import { container } from "../../container";
import { TYPES } from "../../container/types";
import { authorize } from "../../middlewares/AuthorizationMiddleware";
import { validate } from "../../middlewares/validate";
import { ADMIN_ROUTES } from "../../shared/constants";
import { UserRole } from "../../shared/enums/UserRole";
import { loginSchema } from "../../validators/auth/LoginValidator";

import type { IAdminController } from "../../interfaces/controllers/admin/IAdminController";
import type { IAuthMiddleware } from "../../interfaces/middlewares/IAuthMiddleware";

const router = Router();

const adminController = container.get<IAdminController>(
  TYPES.AdminController,
);

const authMiddleware = container.get<IAuthMiddleware>(
  TYPES.AuthMiddleware,
);

const adminAuthorization = authorize(UserRole.ADMIN);

// Admin login
router.post(
  ADMIN_ROUTES.LOGIN,
  validate(loginSchema),
  adminController.login,
);

// Admin provider management
router.get(
  ADMIN_ROUTES.PENDING_PROVIDERS,
  authMiddleware.authenticate,
  adminAuthorization,
  adminController.getPendingProviders,
);

router.patch(
  ADMIN_ROUTES.APPROVE_PROVIDER,
  authMiddleware.authenticate,
  adminAuthorization,
  adminController.approveProvider,
);

router.patch(
  ADMIN_ROUTES.REJECT_PROVIDER,
  authMiddleware.authenticate,
  adminAuthorization,
  adminController.rejectProvider,
);

// Admin user management
router.get(
  ADMIN_ROUTES.USERS,
  authMiddleware.authenticate,
  adminAuthorization,
  adminController.getUsers,
);

router.patch(
  ADMIN_ROUTES.BLOCK_USER,
  authMiddleware.authenticate,
  adminAuthorization,
  adminController.blockUser,
);

router.patch(
  ADMIN_ROUTES.UNBLOCK_USER,
  authMiddleware.authenticate,
  adminAuthorization,
  adminController.unblockUser,
);

router.get(
  ADMIN_ROUTES.ACTIVE_PROVIDERS,
  authMiddleware.authenticate,
  adminAuthorization,
  adminController.getActiveProviders,
);

router.patch(
  ADMIN_ROUTES.BLOCK_PROVIDER,
  authMiddleware.authenticate,
  adminAuthorization,
  adminController.blockProvider,
);

router.patch(
  ADMIN_ROUTES.UNBLOCK_PROVIDER,
  authMiddleware.authenticate,
  adminAuthorization,
  adminController.unblockProvider,
);

export default router;
