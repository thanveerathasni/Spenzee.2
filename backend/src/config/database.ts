import mongoose from "mongoose";

import { env } from "./env.js";
import { container } from "../container/index.js";
import { TYPES } from "../container/types.js";
import { type ILogger } from "../shared/logger/ILogger.js";
const logger = container.get<ILogger>(TYPES.Logger);
export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);

    logger.info("MongoDB connected successfully.", {
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      uri: env.MONGO_URI,
    });
  } catch (error) {
    logger.error(" Failed to connect to MongoDB");
    logger.error("Failed to connect to MongoDB.", { error });

    process.exit(1);
  }
};
