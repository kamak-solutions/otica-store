import type { FastifyInstance } from "fastify";
import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";
import {
  createOrderController,
  getAdminOrderByIdController,
  getAdminOrdersController,
  updateOrderStatusController,
} from "./orders.controller.js";
import type {
  OrderIdParams,
  UpdateOrderStatusBody,
} from "./orders.schemas.js";

export async function ordersRoutes(app: FastifyInstance) {
  app.post("/orders", createOrderController);

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
