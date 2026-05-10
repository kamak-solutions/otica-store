import cors from "@fastify/cors";
import Fastify from "fastify";
import { allowedOrigins, env, isDevelopment } from "./config/env.js";
import { errorHandler } from "./errors/error-handler.js";
import { productsRoutes } from "./modules/products/products.routes.js";
import { healthRoutes } from "./routes/health.routes.js";
import { ordersRoutes } from "./modules/orders/orders.routes.js";
import { adminAuthRoutes } from "./modules/admin-auth/admin-auth.routes.js";
import { categoriesRoutes } from "./modules/categories/categories.routes.js";
import { quoteRequestRoutes } from "./modules/quote-requests/quote-requests.routes.js";
import { adminQuoteRequestRoutes } from "./modules/quote-requests/admin-quote-requests.routes.js";
import rateLimit from "@fastify/rate-limit";
import helmet from "@fastify/helmet";
import { adminAuditRoutes } from "./modules/admin-audit/admin-audit.routes.js";

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

await app.register(helmet, {
  global: true,
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
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

await app.register(rateLimit, {
  global: false,
});

app.setErrorHandler(errorHandler);

app.register(healthRoutes);
app.register(productsRoutes);
app.register(ordersRoutes);
app.register(adminAuthRoutes);
app.register(categoriesRoutes);
app.register(quoteRequestRoutes);
app.register(adminQuoteRequestRoutes);
app.register(adminAuditRoutes);