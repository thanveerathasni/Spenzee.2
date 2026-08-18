import { Router } from "express";

import { container } from "../../container";
import { TYPES } from "../../container/types";

import type { IAdminController } from "../../interfaces/controllers/admin/IAdminController";

import { validate } from "../../middlewares/validate";
import { loginSchema } from "../../validators/auth/LoginValidator";



const router = Router();

const adminController = container.get<IAdminController>(TYPES.AdminController);

router.post("/login",
    validate(loginSchema),
    adminController.login,
)

export default router