import type { FastifyInstance } from "fastify";

import {
  requireAdminAuth,
  requireAdminRole,
} from "../../admin-auth/admin-auth.middleware.js";

import {
  getCustomerRemindersController,
  createCustomerReminderController,
  completeCustomerReminderController,
} from "./crm-reminders.controller.js";

import type {
  CustomerReminderParams,
  ReminderIdParams,
  CreateCustomerReminderBody,
} from "./crm-reminders.schemas.js";

export async function crmRemindersRoutes(
  app: FastifyInstance,
) {
  app.get<{
    Params: CustomerReminderParams;
  }>(
    "/admin/customers/:customerId/reminders",
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
    getCustomerRemindersController,
  );

  app.post<{
    Params: CustomerReminderParams;
    Body: CreateCustomerReminderBody;
  }>(
    "/admin/customers/:customerId/reminders",
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
    createCustomerReminderController,
  );

  app.patch<{
    Params: ReminderIdParams;
  }>(
    "/admin/reminders/:id/complete",
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
    completeCustomerReminderController,
  );
}