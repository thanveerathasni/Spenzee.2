import mongoose from "mongoose";

import { env } from "../config/env";
import { container } from "../container";
import { TYPES } from "../container/types";

import type { IAdminSeedService } from "../interfaces/services/admin/IAdminSeedService";
import type { ILogger } from "../shared/logger/ILogger";

const adminSeedService = container.get<IAdminSeedService>(TYPES.AdminSeedService);
const logger = container.get<ILogger>(TYPES.Logger);

const seed = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);

    logger.info("MongoDB connected for admin seed.");

    await adminSeedService.execute();

    logger.info("Admin seed completed.");
  } catch (error) {
    logger.error("Admin seed failed.", { error });
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

void seed();
