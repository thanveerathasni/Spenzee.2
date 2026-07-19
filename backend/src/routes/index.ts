import { Router } from "express";

import userRoutes from "./user/UserRoutes";

const router = Router();

router.use("/users", userRoutes);

export default router;