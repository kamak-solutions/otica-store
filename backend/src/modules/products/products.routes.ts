import type { FastifyInstance } from "fastify";
import { getProductsController } from "./products.controller.js";

export async function productsRoutes(app: FastifyInstance) {
  app.get("/products", getProductsController);
}