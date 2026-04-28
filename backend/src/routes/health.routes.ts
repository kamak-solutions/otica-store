import type { FastifyInstance } from "fastify";
import { env } from "../config/env.js";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async (request, reply) => {
    request.log.info("Health check requested");

    return reply.send({
      status: "ok",
      service: "otica-showroom-api",
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });
}