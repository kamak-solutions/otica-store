import type { FastifyInstance } from "fastify";
import {
  getProductBySlugController,
  getProductsController,
} from "./products.controller.js";

export async function productsPublicRoutes(app: FastifyInstance) {
  app.get("/products", getProductsController);
  app.get("/products/:slug", getProductBySlugController);
}