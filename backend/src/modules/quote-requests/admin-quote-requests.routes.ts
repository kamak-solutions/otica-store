import type { FastifyInstance } from "fastify";
import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";
import {
  listAdminQuoteRequestsController,
  updateAdminQuoteRequestStatusController,
} from "./admin-quote-requests.controller.js";
import type {
  UpdateQuoteRequestStatusBody,
  UpdateQuoteRequestStatusParams,
} from "./admin-quote-requests.schemas.js";

export async function adminQuoteRequestRoutes(app: FastifyInstance) {
  app.get(
    "/admin/quote-requests",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    listAdminQuoteRequestsController,
  );

  app.patch<{
    Params: UpdateQuoteRequestStatusParams;
    Body: UpdateQuoteRequestStatusBody;
  }>(
    "/admin/quote-requests/:id/status",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    updateAdminQuoteRequestStatusController,
  );
}