import type { FastifyInstance } from "fastify";

import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";

import {
  createCustomerPrescriptionController,
  getCustomerPrescriptionsController,
} from "./prescriptions.controller.js";

import type {
  CreatePrescriptionBody,
  CustomerPrescriptionParams,
} from "./prescriptions.schemas.js";

export async function prescriptionsRoutes(app: FastifyInstance) {
  app.get<{
    Params: CustomerPrescriptionParams;
  }>(
    "/admin/customers/:customerId/prescriptions",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getCustomerPrescriptionsController,
  );

  app.post<{
    Params: CustomerPrescriptionParams;
    Body: CreatePrescriptionBody;
  }>(
    "/admin/customers/:customerId/prescriptions",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    createCustomerPrescriptionController,
  );
}
