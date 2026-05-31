import type { FastifyInstance } from "fastify";

import {
  requireAdminAuth,
  requireAdminRole,
} from "../../admin-auth/admin-auth.middleware.js";

import {
  getCustomerInteractionsController,
  createCustomerInteractionController,
} from "./crm-interactions.controller.js";

import type {
  CustomerInteractionParams,
  CreateCustomerInteractionBody,
} from "./crm-interactions.schemas.js";

export async function crmInteractionsRoutes(
  app: FastifyInstance,
) {
  app.get<{
    Params: CustomerInteractionParams;
  }>(
    "/admin/customers/:customerId/interactions",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole([
          "owner",
          "admin",
          "collaborator",
          "viewer",
        ]),
      ],
    },
    getCustomerInteractionsController,
  );

  app.post<{
    Params: CustomerInteractionParams;
    Body: CreateCustomerInteractionBody;
  }>(
    "/admin/customers/:customerId/interactions",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole([
          "owner",
          "admin",
          "collaborator",
        ]),
      ],
    },
    createCustomerInteractionController,
  );
}