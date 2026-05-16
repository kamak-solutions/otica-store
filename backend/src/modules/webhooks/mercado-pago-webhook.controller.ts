import type { FastifyReply, FastifyRequest } from "fastify";
import { processMercadoPagoWebhook } from "./mercado-pago-webhook.service.js";

type MercadoPagoWebhookBody = {
  type?: string;
  action?: string;
  data?: {
    id?: string;
  };
};

export async function mercadoPagoWebhookController(
  request: FastifyRequest<{
    Body: MercadoPagoWebhookBody;
  }>,
  reply: FastifyReply,
) {
  request.log.info(
    {
      body: request.body,
      signature: request.headers["x-signature"],
      requestId: request.headers["x-request-id"],
    },
    "Mercado Pago webhook received",
  );

  const result = await processMercadoPagoWebhook(request.body);

  return reply.send({
    received: true,
    result,
  });
}
