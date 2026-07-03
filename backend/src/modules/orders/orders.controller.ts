import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../errors/app-error.js";
import {
  createOrder,
  createAdminOrder,
  findAdminOrderById,
  listAdminOrders,
  createOrderPaymentLink,
  updateOrderStatus,
} from "./orders.service.js";
import { mapOrderToHttp } from "./orders.mapper.js";
import {
  createOrderBodySchema,
  orderIdParamsSchema,
  updateOrderStatusBodySchema,
  type UpdateOrderStatusBody,
  type CreateOrderBody,
  type OrderIdParams,
} from "./orders.schemas.js";
import { createAdminAuditLog } from "../admin-audit/admin-audit.service.js";

export async function createOrderController(
  request: FastifyRequest<{
    Body: CreateOrderBody;
  }>,
  reply: FastifyReply,
) {
  const body = createOrderBodySchema.parse(request.body);

  request.log.info(
    {
      customerEmail: body.customer.customerEmail,
      itemsCount: body.items.length,
    },
    "Creating order",
  );

  const order = await createOrder(body);

  return reply.status(201).send({
    data: mapOrderToHttp(order),
    message: "Pedido criado com sucesso.",
  });
}
export async function createAdminOrderController(
  request: FastifyRequest<{
    Body: {
      customerId: string;
      notes?: string;
      attendanceId?: string;
      items: Array<{
        productId: string;
        quantity: number;
      }>;
    };
  }>,
  reply: FastifyReply,
) {
  const order = await createAdminOrder({
    ...request.body,
    createdByAdminId: request.admin?.sub,
  });

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "order.created_from_crm",
    entity: "Order",
    entityId: order.id,
    metadata: {
      customerId: order.customerId,
      itemsCount: order.items.length,
      subtotal: String(order.subtotal),
    },
  });

  return reply.status(201).send({
    data: mapOrderToHttp(order),
    message: "Pedido criado com sucesso.",
  });
}

export async function getAdminOrdersController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.info("Listing admin orders");

  const orders = await listAdminOrders();

  return reply.send({
    data: orders.map(mapOrderToHttp),
  });
}

export async function getAdminOrderByIdController(
  request: FastifyRequest<{
    Params: OrderIdParams;
  }>,
  reply: FastifyReply,
) {
  const { id } = orderIdParamsSchema.parse(request.params);

  request.log.info({ id }, "Finding admin order by id");

  const order = await findAdminOrderById(id);

  if (!order) {
    throw new AppError("Pedido não encontrado.", 404, "Not found");
  }

  return reply.send({
    data: mapOrderToHttp(order),
  });
}
export async function updateOrderStatusController(
  request: FastifyRequest<{
    Params: OrderIdParams;
    Body: UpdateOrderStatusBody;
  }>,
  reply: FastifyReply,
) {
  const { id } = orderIdParamsSchema.parse(request.params);
  const { status } = updateOrderStatusBodySchema.parse(request.body);

  request.log.info({ id, status }, "Updating order status");

  const order = await updateOrderStatus(id, status);

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "order.status_updated",
    entity: "Order",
    entityId: order.id,
    metadata: {
      newStatus: order.status,
    },
  });

  return reply.send({
    data: mapOrderToHttp(order),
    message: "Status do pedido atualizado com sucesso.",
  });
}
export async function createAdminOrderPaymentLinkController(
  request: FastifyRequest<{
    Params: OrderIdParams;
  }>,
  reply: FastifyReply,
) {
  const { id } = orderIdParamsSchema.parse(request.params);

  request.log.info({ id }, "Creating Mercado Pago payment link for order");

  const order = await createOrderPaymentLink(id);

  await createAdminAuditLog({
    adminId: request.admin?.sub,
    adminEmail: request.admin?.email,
    adminRole: request.admin?.role,
    action: "order.payment_link_created",
    entity: "Order",
    entityId: order.id,
    metadata: {
      paymentProvider: order.paymentProvider,
      paymentProviderId: order.paymentProviderId,
      paymentStatus: order.paymentStatus,
    },
  });

  return reply.send({
    data: mapOrderToHttp(order),
    message: "Link de pagamento criado com sucesso.",
  });
}
