import type { FastifyReply, FastifyRequest } from "fastify";
import { createOrder } from "./orders.service.js";
import { mapOrderToHttp } from "./orders.mapper.js";
import {
  createOrderBodySchema,
  type CreateOrderBody,
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