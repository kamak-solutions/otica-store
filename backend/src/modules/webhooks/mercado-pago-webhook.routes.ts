import type { FastifyInstance } from "fastify";
import { mercadoPagoWebhookController } from "./mercado-pago-webhook.controller.js";

export async function mercadoPagoWebhookRoutes(app: FastifyInstance) {
  app.post("/webhooks/mercado-pago", mercadoPagoWebhookController);
}
