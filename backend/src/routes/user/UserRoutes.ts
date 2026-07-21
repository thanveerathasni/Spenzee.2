import { Router } from "express";

import { container } from "../../container/container";
import { TYPES } from "../../container/types";
import { type IUserController } from "../../interfaces/controllers/user/IUserController";
const router = Router();
const userController = container.get<IUserController>(TYPES.UserController);

router.post("/", userController.createUser.bind(userController));

router.get("/:id", userController.getUserById.bind(userController));

export default router;
