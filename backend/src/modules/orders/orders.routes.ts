import type { FastifyInstance } from "fastify";
import { createOrderController } from "./orders.controller.js";

export async function ordersRoutes(app: FastifyInstance) {
  app.post("/orders", createOrderController);
}