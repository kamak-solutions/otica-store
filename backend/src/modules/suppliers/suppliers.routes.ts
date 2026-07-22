import type { FastifyInstance } from "fastify";

import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";

import {
  createSupplierController,
  deleteSupplierController,
  getSupplierByIdController,
  getSuppliersController,
  updateSupplierController,
} from "./suppliers.controller.js";

import type {
  CreateSupplierBody,
  SupplierIdParams,
  UpdateSupplierBody,
} from "./suppliers.schemas.js";

export async function suppliersRoutes(app: FastifyInstance) {
  app.get(
    "/admin/suppliers",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getSuppliersController,
  );

  app.get<{
    Params: SupplierIdParams;
  }>(
    "/admin/suppliers/:id",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getSupplierByIdController,
  );

  app.post<{
    Body: CreateSupplierBody;
  }>(
    "/admin/suppliers",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin"]),
      ],
    },
    createSupplierController,
  );

  app.put<{
    Params: SupplierIdParams;
    Body: UpdateSupplierBody;
  }>(
    "/admin/suppliers/:id",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin"]),
      ],
    },
    updateSupplierController,
  );

  app.delete<{
    Params: SupplierIdParams;
  }>(
    "/admin/suppliers/:id",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner"]),
      ],
    },
    deleteSupplierController,
  );
}