import Fastify from "fastify";
import { env, isDevelopment } from "./config/env.js";
import { healthRoutes } from "./routes/health.routes.js";

export const app = Fastify({
  logger: {
    level: isDevelopment ? "debug" : env.LOG_LEVEL,
    transport: isDevelopment
      ? {
          target: "pino-pretty",
          options: {
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname",
            colorize: true,
          },
        }
      : undefined,
  },
});

app.register(healthRoutes);