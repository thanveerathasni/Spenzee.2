import "reflect-metadata";

import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

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
// test
