import type { FastifyInstance } from "fastify";
import {
  createOrderController,
  getAdminOrderByIdController,
  getAdminOrdersController,
} from "./orders.controller.js";

export async function ordersRoutes(app: FastifyInstance) {
  app.post("/orders", createOrderController);

  app.get("/admin/orders", getAdminOrdersController);
  app.get("/admin/orders/:id", getAdminOrderByIdController);
}