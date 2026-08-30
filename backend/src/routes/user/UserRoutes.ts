import { Router } from "express";

import { container } from "../../container";
import { TYPES } from "../../container/types";
import { USER_ROUTES } from "../../shared/constants";

import type { IUserController } from "../../interfaces/controllers/user/IUserController";

const router = Router();

const userController = container.get<IUserController>(
  TYPES.UserController,
);

router.post(
  USER_ROUTES.CREATE,
  userController.createUser.bind(userController),
);

router.get(
  USER_ROUTES.GET_BY_ID,
  userController.getUserById.bind(userController),
);

export default router;
