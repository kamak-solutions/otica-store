import type { FastifyInstance } from "fastify";
import { crmRemindersRoutes } from "./reminders/crm-reminders.routes.js";

import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";

import {
  createCustomerNoteController,
  getCustomerNotesController,
} from "./crm.controller.js";

import type {
  CustomerIdParams,
  CreateCustomerNoteBody,
} from "./crm.schemas.js";

export async function crmRoutes(app: FastifyInstance) {
  app.get<{
    Params: CustomerIdParams;
  }>(
    "/admin/customers/:customerId/notes",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getCustomerNotesController,
  );

  app.post<{
    Params: CustomerIdParams;
    Body: CreateCustomerNoteBody;
  }>(
    "/admin/customers/:customerId/notes",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    createCustomerNoteController,
  );

  await app.register(crmRemindersRoutes);
}
