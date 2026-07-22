import type { FastifyInstance } from "fastify";

import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";

import {
  createLaboratoryOrderController,
  getLaboratoryOrderByIdController,
  getLaboratoryOrdersController,
  updateLaboratoryOrderStatusController,
} from "./laboratory-orders.controller.js";

import type {
  CreateLaboratoryOrderBody,
  LaboratoryOrderIdParams,
  UpdateLaboratoryOrderStatusBody,
} from "./laboratory-orders.schemas.js";

export async function laboratoryOrdersRoutes(
  app: FastifyInstance,
) {
  app.get(
    "/admin/laboratory-orders",
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
    getLaboratoryOrdersController,
  );

  app.get<{
    Params: LaboratoryOrderIdParams;
  }>(
    "/admin/laboratory-orders/:id",
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
    getLaboratoryOrderByIdController,
  );

  app.post<{
    Body: CreateLaboratoryOrderBody;
  }>(
    "/admin/laboratory-orders",
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
    createLaboratoryOrderController,
  );

  app.patch<{
    Params: LaboratoryOrderIdParams;
    Body: UpdateLaboratoryOrderStatusBody;
  }>(
    "/admin/laboratory-orders/:id/status",
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
    updateLaboratoryOrderStatusController,
  );
}