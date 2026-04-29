import type { FastifyInstance } from "fastify";
import { adminLoginController } from "./admin-auth.controller.js";

export async function adminAuthRoutes(app: FastifyInstance) {
  app.post("/admin/auth/login", adminLoginController);
}