import type { FastifyInstance } from "fastify";

import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";

import {
  createAdminCustomerController,
  getAdminCustomerByIdController,
  getAdminCustomersController,
  updateCustomerCrmStatusController,
} from "./customers.controller.js";

import type {
  CreateAdminCustomerBody,
  CustomerIdParams,
  UpdateCustomerCrmStatusBody,
} from "./customers.schemas.js";

export async function customersRoutes(app: FastifyInstance) {
  app.get(
    "/admin/customers",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getAdminCustomersController,
  );

  app.get<{
    Params: CustomerIdParams;
  }>(
    "/admin/customers/:id",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getAdminCustomerByIdController,
  );

  app.post<{
    Body: CreateAdminCustomerBody;
  }>(
    "/admin/customers",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    createAdminCustomerController,
  );

  app.patch<{
    Params: CustomerIdParams;
    Body: UpdateCustomerCrmStatusBody;
  }>(
    "/admin/customers/:id/crm-status",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    updateCustomerCrmStatusController,
  );
}
