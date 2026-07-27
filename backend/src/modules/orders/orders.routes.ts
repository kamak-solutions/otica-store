import type { FastifyInstance } from "fastify";
import {
  requireAdminAuth,
  requireAdminRole,
} from "../admin-auth/admin-auth.middleware.js";
import {
  confirmManualOrderPaymentController,
  createAdminOrderController,
  createAdminOrderPaymentLinkController,
  createOrderController,
  getAdminOrderByIdController,
  getAdminOrdersController,
  updateOrderStatusController,
  refundManualOrderPaymentController,
  getOrderPaymentEventsController,
} from "./orders.controller.js";
import type {
  ConfirmManualPaymentBody,
  OrderIdParams,
  RefundManualPaymentBody,
  UpdateOrderStatusBody,
} from "./orders.schemas.js";

export async function ordersRoutes(app: FastifyInstance) {
  app.post("/orders", createOrderController);
  app.post<{
    Body: {
      customerId: string;
      attendanceId?: string;
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
  app.get<{
    Params: OrderIdParams;
  }>(
    "/admin/orders/:id/payment-events",
    {
      preHandler: [
        requireAdminAuth,
        requireAdminRole(["owner", "admin", "collaborator", "viewer"]),
      ],
    },
    getOrderPaymentEventsController,
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
  app.post<{
    Params: OrderIdParams;
    Body: ConfirmManualPaymentBody;
  }>(
    "/admin/orders/:id/manual-payment",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner", "admin"])],
    },
    confirmManualOrderPaymentController,
  );
  app.post<{
    Params: OrderIdParams;
    Body: RefundManualPaymentBody;
  }>(
    "/admin/orders/:id/manual-payment/refund",
    {
      preHandler: [requireAdminAuth, requireAdminRole(["owner"])],
    },
    refundManualOrderPaymentController,
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
