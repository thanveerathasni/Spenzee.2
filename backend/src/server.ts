import "reflect-metadata";
import { TYPES } from "./container/types.js";
import { container } from "./container/index.js";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { ILogger } from "./shared/logger/ILogger.js";
const logger = container.get<ILogger>(TYPES.Logger);
const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      logger.info(` Server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    logger.error(" Server startup failed");
    logger.error(error);

    process.exit(1);
  }
};

startServer().catch((error) => {
  logger.error("Unhandled server startup error:", error);
  process.exit(1);
});
