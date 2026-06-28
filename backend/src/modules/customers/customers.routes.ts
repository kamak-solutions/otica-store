import type { FastifyInstance } from "fastify";
import { requireAdminAuth } from "../admin-auth/admin-auth.middleware.js";
import {
  getAdminCustomersController,
  getAdminCustomerByIdController,
  updateCustomerCrmStatusController,
  createAdminCustomerController,
} from "./customers.controller.js";

export async function customersRoutes(app: FastifyInstance) {
  app.get(
    "/admin/customers",
    { preHandler: requireAdminAuth },
    getAdminCustomersController,
  );
  app.get<{
    Params: {
      id: string;
    };
  }>(
    "/admin/customers/:id",
    {
      preHandler: requireAdminAuth,
    },
    getAdminCustomerByIdController,
  );
  app.post<{
    Body: {
      name: string;
      email: string;
      phone: string;

      cpf?: string;
      birthDate?: string;

      zipcode: string;
      state: string;
      street: string;
      number: string;
      complement?: string;
      district: string;
      city: string;

      crmStatus?: string;

      lgpdAccepted: boolean;
      lgpdConsentSource?: string;
    };
  }>(
    "/admin/customers",
    {
      preHandler: requireAdminAuth,
    },
    createAdminCustomerController,
  );
  app.patch<{
    Params: {
      id: string;
    };
    Body: {
      crmStatus: string;
    };
  }>(
    "/admin/customers/:id/crm-status",
    {
      preHandler: requireAdminAuth,
    },
    updateCustomerCrmStatusController,
  );
}
