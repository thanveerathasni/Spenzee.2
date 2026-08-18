import mongoose from "mongoose";

import { env } from "../config/env";
import { container } from "../container";
import { TYPES } from "../container/types";
import type { IAdminSeedService } from "../interfaces/services/admin/IAdminSeedService";

const adminSeedService =
  container.get<IAdminSeedService>(
    TYPES.AdminSeedService,
  );

const seed = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);

    console.log("MongoDB connected.");

    await adminSeedService.execute();

    console.log("Admin seed completed.");
  } catch (error) {
    console.error("Admin seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

void seed();
