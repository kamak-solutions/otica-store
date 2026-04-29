import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../errors/app-error.js";
import {
  createOrder,
  findAdminOrderById,
  listAdminOrders,
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

  return reply.send({
    data: mapOrderToHttp(order),
    message: "Status do pedido atualizado com sucesso.",
  });
}
