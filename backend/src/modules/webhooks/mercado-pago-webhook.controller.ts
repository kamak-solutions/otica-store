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

  try {
    const result = await processMercadoPagoWebhook(request.body);

    return reply.send({
      received: true,
      result,
    });
  } catch (error) {
    request.log.error(
      {
        error,
        body: request.body,
      },
      "Mercado Pago webhook processing failed",
    );

    return reply.send({
      received: true,
      ignored: true,
    });
  }
}