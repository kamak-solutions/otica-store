import type { FastifyInstance } from "fastify";
import { requireAdminAuth } from "../admin-auth/admin-auth.middleware.js";
import { getAdminCustomersController } from "./customers.controller.js";

export async function customersRoutes(app: FastifyInstance) {
  app.get(
    "/admin/customers",
    { preHandler: requireAdminAuth },
    getAdminCustomersController,
  );
}
