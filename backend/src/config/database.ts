import mongoose from "mongoose";
import { env } from "./env.js";
import {TYPES} from "../container/types.js"
import {container} from "../container/index.js"
import {ILogger} from "../shared/logger/ILogger.js"
const logger = container.get<ILogger>(TYPES.Logger);
export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);

    logger.info(" MongoDB connected successfully");
  } catch (error) {
    logger.error(" Failed to connect to MongoDB");
    logger.error(error);

    process.exit(1);
  }
};
