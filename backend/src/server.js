import { app } from "./app.js";
import { env } from "./config/env.js";

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3333;

    await app.listen({
      port,
      host: "0.0.0.0",
    });

    app.log.info(`API running on port ${port}`);
  } catch (error) {
    app.log.error(error, "Failed to start server");
    process.exit(1);
  }
};

start();