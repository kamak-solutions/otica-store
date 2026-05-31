import type { FastifyInstance } from "fastify";
import { requireAdminAuth } from "../admin-auth/admin-auth.middleware.js";
import {
  getAdminCustomersController,
  getAdminCustomerByIdController,
} from "./customers.controller.js";

export async function customersRoutes(app: FastifyInstance) {
  app.get(
    "/admin/customers",
    { preHandler: requireAdminAuth },
    getAdminCustomersController,
  );
  app.get<{
    Params: {
      id: string;
    };
  }>(
    "/admin/customers/:id",
    {
      preHandler: requireAdminAuth,
    },
    getAdminCustomerByIdController,
  );
}
