import type { FastifyInstance } from "fastify";

import { campaignsController } from "./campaigns.controller.js";

import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";

type CampaignParams = {
  Params: {
    id: string;
  };
};

export async function campaignsRoutes(app: FastifyInstance) {
  // PUBLICO
  app.get("/campaigns", campaignsController.listPublic);

  // ADMIN
  app.get(
    "/admin/campaigns",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    campaignsController.list,
  );

  app.post(
    "/admin/campaigns",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner", "admin"])],
    },
    campaignsController.create,
  );

  app.put<CampaignParams>(
    "/admin/campaigns/:id",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner", "admin"])],
    },
    campaignsController.update,
  );

  app.patch<CampaignParams>(
    "/admin/campaigns/:id/toggle",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner", "admin"])],
    },
    campaignsController.toggle,
  );

  app.delete<CampaignParams>(
    "/admin/campaigns/:id",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner"])],
    },
    campaignsController.delete,
  );
}
