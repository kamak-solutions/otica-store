import type { FastifyInstance } from "fastify";
import { requireAdminAuth } from "../admin-auth/admin-auth.middleware.js";
import { listAdminAuditLogsController } from "./admin-audit.controller.js";

export async function adminAuditRoutes(app: FastifyInstance) {
  app.get(
    "/admin/audit-logs",
    { preHandler: requireAdminAuth },
    listAdminAuditLogsController,
  );
}