import cors from "@fastify/cors";
import Fastify from "fastify";
import { allowedOrigins, env, isDevelopment } from "./config/env.js";
import { errorHandler } from "./errors/error-handler.js";
import { productsRoutes } from "./modules/products/products.routes.js";
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

await app.register(cors, {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    const error = new Error("Not allowed by CORS") as Error & {
      statusCode?: number;
    };

    error.statusCode = 403;

    callback(error, false);
  },
  credentials: true,
});

app.setErrorHandler(errorHandler);

app.register(healthRoutes);
app.register(productsRoutes);
