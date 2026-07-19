import { Router } from "express";

import { UserController } from "../../controllers/user/UserController";
import { UserRepository } from "../../repositories/user/UserRepository";
import { UserService } from "../../services/user/UserService";

const router = Router();

const userRepository = new UserRepository();

const userService = new UserService(userRepository);

const userController = new UserController(userService);




router.post(
    "/",
    userController.createUser.bind(userController)
);

router.get(
    "/:id",
    userController.getUserById.bind(userController)
);

export default router;





