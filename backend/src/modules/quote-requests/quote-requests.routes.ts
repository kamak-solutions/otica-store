import type { FastifyInstance } from "fastify";
import { createQuoteRequestController } from "./quote-requests.controller.js";

export async function quoteRequestRoutes(app: FastifyInstance) {
  app.post("/quote-requests", createQuoteRequestController);
}