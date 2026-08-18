import { Router } from "express";

import { container } from "../../container";
import { TYPES } from "../../container/types";
import { validate } from "../../middlewares/validate";
import { providerApplicationSchema } from "../../validators/provider/ProviderApplicationValidator";

import type { IProviderController } from "../../interfaces/controllers/provider/IProviderController";

const router = Router();

const providerController = container.get<IProviderController>(TYPES.ProviderController);

router.post("/apply", validate(providerApplicationSchema), providerController.apply);

export default router;
