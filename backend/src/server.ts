import "reflect-metadata";

import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      console.log(` Server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error(" Server startup failed");
    console.error(error);

    process.exit(1);
  }
};

startServer();