import type { FastifyInstance } from "fastify";
import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";
import {
  createAdminOrderController,
  createAdminOrderPaymentLinkController,
  createOrderController,
  getAdminOrderByIdController,
  getAdminOrdersController,
  updateOrderStatusController,
} from "./orders.controller.js";
import type { OrderIdParams, UpdateOrderStatusBody } from "./orders.schemas.js";

export async function ordersRoutes(app: FastifyInstance) {
  app.post("/orders", createOrderController);
  app.post<{
    Body: {
      customerId: string;
      notes?: string;
      items: Array<{
        productId: string;
        quantity: number;
      }>;
    };
  }>(
    "/admin/orders",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    createAdminOrderController,
  );

  app.get(
    "/admin/orders",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getAdminOrdersController,
  );

  app.get<{
    Params: OrderIdParams;
  }>(
    "/admin/orders/:id",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getAdminOrderByIdController,
  );

  app.post<{
    Params: OrderIdParams;
  }>(
    "/admin/orders/:id/payment-link",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    createAdminOrderPaymentLinkController,
  );

  app.patch<{
    Params: OrderIdParams;
    Body: UpdateOrderStatusBody;
  }>(
    "/admin/orders/:id/status",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator"]),
      ],
    },
    updateOrderStatusController,
  );
}
