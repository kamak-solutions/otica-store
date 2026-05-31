import type { FastifyReply, FastifyRequest } from "fastify";

import {
  createCustomerInteraction,
  listCustomerInteractions,
} from "./crm-interactions.service.js";

import {
  customerInteractionParamsSchema,
  createCustomerInteractionBodySchema,
  type CustomerInteractionParams,
  type CreateCustomerInteractionBody,
} from "./crm-interactions.schemas.js";

export async function getCustomerInteractionsController(
  request: FastifyRequest<{
    Params: CustomerInteractionParams;
  }>,
  reply: FastifyReply,
) {
  const { customerId } = customerInteractionParamsSchema.parse(
    request.params,
  );

  const interactions = await listCustomerInteractions(
    customerId,
  );

  return reply.send({
    data: interactions,
  });
}

export async function createCustomerInteractionController(
  request: FastifyRequest<{
    Params: CustomerInteractionParams;
    Body: CreateCustomerInteractionBody;
  }>,
  reply: FastifyReply,
) {
  const { customerId } = customerInteractionParamsSchema.parse(
    request.params,
  );

  const { type, description } =
    createCustomerInteractionBodySchema.parse(
      request.body,
    );

  const interaction =
    await createCustomerInteraction(
      customerId,
      type,
      description,
    );

  return reply.status(201).send({
    data: interaction,
  });
}