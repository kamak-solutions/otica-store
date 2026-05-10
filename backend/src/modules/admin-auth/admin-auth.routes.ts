import type { FastifyInstance } from "fastify";
import { adminLoginController } from "./admin-auth.controller.js";

export async function adminAuthRoutes(app: FastifyInstance) {
  app.post(
  "/admin/auth/login",
  {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: "15 minutes",
      },
    },
  },
  adminLoginController,
);
}