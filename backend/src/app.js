import Fastify from 'fastify'
import { healthRoutes } from './routes/health.routes.js';

const isDevelopment = process.env.NODE_ENV!=="production"

export const app = Fastify({
  logger: {
    level: isDevelopment ? "debug" : (process.env.LOG_LEVEL || "info"), // debug em dev
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

