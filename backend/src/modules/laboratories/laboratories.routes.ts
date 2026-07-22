import type { FastifyInstance } from "fastify";

import {
  createLaboratoryController,
  deleteLaboratoryController,
  getLaboratoriesController,
  updateLaboratoryController,
} from "./laboratories.controller.js";

import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";

type LaboratoryIdParams = {
  id: string;
};

export async function laboratoriesRoutes(app: FastifyInstance) {
  app.get(
    "/admin/laboratories",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getLaboratoriesController,
  );

  app.post(
    "/admin/laboratories",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner", "admin"])],
    },
    createLaboratoryController,
  );

  app.put<{
    Params: LaboratoryIdParams;
  }>(
    "/admin/laboratories/:id",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner", "admin"])],
    },
    updateLaboratoryController,
  );

  app.delete<{
    Params: LaboratoryIdParams;
  }>(
    "/admin/laboratories/:id",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner"])],
    },
    deleteLaboratoryController,
  );
}
